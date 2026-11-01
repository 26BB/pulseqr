import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdminDashboard from '../src/components/admin/AdminDashboard';
import QrStandeeGenerator from '../src/components/admin/QrStandeeGenerator';
import { INITIAL_SETTINGS } from '../src/data/mockData';

describe('Section B: Admin Flow Tests', () => {
  const sampleFeedbacks = [
    {
      id: 'fb-test-1',
      table: '02',
      timestamp: '2026-11-01T10:00:00.000Z',
      displayTime: '10m ago',
      ratings: { food: 5, service: 5, ambiance: 5 },
      overallScore: 5.0,
      comment: 'Best flat white in town!',
      tags: ['Great Coffee ☕'],
      status: 'ACKNOWLEDGED',
      barista: 'Pranav',
      guestName: 'Ananya S.',
      isAlert: false,
    },
    {
      id: 'fb-test-2',
      table: '04',
      timestamp: '2026-11-01T10:05:00.000Z',
      displayTime: '5m ago',
      ratings: { food: 1, service: 1, ambiance: 1 },
      overallScore: 1.0,
      comment: 'Coffee was cold and table was dirty.',
      tags: ['Cold Food ⚠️', 'Dirty Table 🧹'],
      status: 'ALERT_TRIGGERED',
      barista: 'Aakash',
      guestName: 'Rahul M.',
      isAlert: true,
    },
    {
      id: 'fb-test-3',
      table: '09',
      timestamp: '2026-11-01T10:10:00.000Z',
      displayTime: 'Just now',
      ratings: { food: 3, service: 3, ambiance: 3 },
      overallScore: 3.0,
      comment: 'Average visit, standard latte.',
      tags: ['Table 09 ☕'],
      status: 'ACKNOWLEDGED',
      barista: 'Pranav',
      guestName: 'Guest',
      isAlert: false,
    },
  ];

  const mockSettings = {
    ...INITIAL_SETTINGS,
    cafeName: 'Brew & Beans',
    branch: 'Koregaon Park, Pune',
    ownerName: 'Rohan Kulkarni',
    ownerPhone: '+919823012345',
    tableCount: 15,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('B.2: KPI Calculation Correctness - calculates total, average score, and pending alerts accurately', () => {
    render(
      <AdminDashboard
        feedbacks={sampleFeedbacks}
        settings={mockSettings}
        onResolveFeedback={vi.fn()}
        onSaveSettings={vi.fn()}
        onResetData={vi.fn()}
        onOpenStandees={vi.fn()}
      />
    );

    // Total feedbacks = 3
    expect(screen.getByText("Today's Feedbacks")).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();

    // Average rating = (5.0 + 1.0 + 3.0) / 3 = 3.0
    expect(screen.getByText("Overall Avg Rating")).toBeInTheDocument();
    expect(screen.getByText('3.0')).toBeInTheDocument();

    // Pending alerts = 1 (fb-test-2)
    expect(screen.getByText("Negative Alerts")).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText(/Action Needed On Floor/i)).toBeInTheDocument();
  });

  it('B.3: Filter Toggles - filters stream by All, Alerts, and 5★ Praises', async () => {
    const user = userEvent.setup();

    render(
      <AdminDashboard
        feedbacks={sampleFeedbacks}
        settings={mockSettings}
        onResolveFeedback={vi.fn()}
        onSaveSettings={vi.fn()}
        onResetData={vi.fn()}
        onOpenStandees={vi.fn()}
      />
    );

    // Initially all 3 items visible
    expect(screen.getByText('Table #02')).toBeInTheDocument();
    expect(screen.getByText('Table #04')).toBeInTheDocument();
    expect(screen.getByText('Table #09')).toBeInTheDocument();

    // Click Alerts filter
    const alertsFilterBtn = screen.getByRole('button', { name: /Alerts \(1\)/i });
    await user.click(alertsFilterBtn);

    // Only Table #04 should remain
    expect(screen.queryByText('Table #02')).not.toBeInTheDocument();
    expect(screen.getByText('Table #04')).toBeInTheDocument();
    expect(screen.queryByText('Table #09')).not.toBeInTheDocument();

    // Click 5★ Praises filter
    const fiveStarFilterBtn = screen.getByRole('button', { name: /5★ Praises/i });
    await user.click(fiveStarFilterBtn);

    // Only Table #02 (5.0) should remain
    expect(screen.getByText('Table #02')).toBeInTheDocument();
    expect(screen.queryByText('Table #04')).not.toBeInTheDocument();
    expect(screen.queryByText('Table #09')).not.toBeInTheDocument();

    // Click All filter
    const allFilterBtn = screen.getByRole('button', { name: /All \(3\)/i });
    await user.click(allFilterBtn);

    expect(screen.getByText('Table #02')).toBeInTheDocument();
    expect(screen.getByText('Table #04')).toBeInTheDocument();
    expect(screen.getByText('Table #09')).toBeInTheDocument();
  });

  it('B.4 & B.5: Damage Control Modal Launch & WhatsApp Link Generation', async () => {
    const user = userEvent.setup();
    const handleResolve = vi.fn();
    const windowOpenSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

    render(
      <AdminDashboard
        feedbacks={sampleFeedbacks}
        settings={mockSettings}
        onResolveFeedback={handleResolve}
        onSaveSettings={vi.fn()}
        onResetData={vi.fn()}
        onOpenStandees={vi.fn()}
      />
    );

    // Click on Table #04 alert card
    const damageControlBtn = screen.getByText('Damage Control');
    await user.click(damageControlBtn);

    // Verify modal is open
    expect(screen.getByText(/Feedback Details • Table #04/i)).toBeInTheDocument();
    expect(screen.getAllByText(/"Coffee was cold and table was dirty\."/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/NEEDS ATTENTION/i)).toBeInTheDocument();

    // Click Damage Control WhatsApp
    const whatsappBtn = screen.getByRole('button', { name: /Damage Control WhatsApp/i });
    await user.click(whatsappBtn);

    expect(windowOpenSpy).toHaveBeenCalledTimes(1);
    const openedUrl = windowOpenSpy.mock.calls[0][0];
    expect(openedUrl).toContain('https://wa.me/919823012345');
    expect(openedUrl).toContain(encodeURIComponent('Rahul M.'));
    expect(openedUrl).toContain(encodeURIComponent('Table 04'));

    expect(handleResolve).toHaveBeenCalledWith(
      'fb-test-2',
      'RESOLVED',
      'Contacted guest via WhatsApp'
    );
  });

  it('B.6: Resolving an Incident with custom note from detail modal', async () => {
    const user = userEvent.setup();
    const handleResolve = vi.fn();

    render(
      <AdminDashboard
        feedbacks={sampleFeedbacks}
        settings={mockSettings}
        onResolveFeedback={handleResolve}
        onSaveSettings={vi.fn()}
        onResetData={vi.fn()}
        onOpenStandees={vi.fn()}
      />
    );

    // Open Table #04
    await user.click(screen.getByText('Damage Control'));

    // Type custom note
    const noteInput = screen.getByPlaceholderText(/Optional resolution note/i);
    await user.type(noteInput, 'Replaced cold brew with pour-over and apologized.');

    // Click Mark Resolved
    const resolveBtn = screen.getByRole('button', { name: /Mark Resolved/i });
    await user.click(resolveBtn);

    expect(handleResolve).toHaveBeenCalledWith(
      'fb-test-2',
      'RESOLVED',
      'Replaced cold brew with pour-over and apologized.'
    );
  });

  it('B.7: Acrylic Standee Generator - renders table selector and dynamic QR endpoint', async () => {
    const user = userEvent.setup();
    const windowPrintSpy = vi.spyOn(window, 'print').mockImplementation(() => {});

    render(
      <QrStandeeGenerator
        settings={mockSettings}
        onClose={vi.fn()}
      />
    );

    // Title and branding
    expect(screen.getByText(/Acrylic Table Standee & QR Generator/i)).toBeInTheDocument();
    expect(screen.getByText('TABLE #04')).toBeInTheDocument();

    // Select different table
    const select = screen.getByRole('combobox');
    await user.selectOptions(select, '11');

    expect(screen.getByText('TABLE #11')).toBeInTheDocument();

    // Click Print
    const printBtn = screen.getByRole('button', { name: /Print A6 Standees/i });
    await user.click(printBtn);
    expect(windowPrintSpy).toHaveBeenCalledTimes(1);
  });
});
