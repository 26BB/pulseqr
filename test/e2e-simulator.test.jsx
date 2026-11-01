import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../src/App';
import { resetToSeedData } from '../src/data/store';

// Mock canvas-confetti
vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

describe('Section B.1 & End-to-End Split Simulator Integration', () => {
  beforeEach(() => {
    localStorage.clear();
    resetToSeedData();
    vi.clearAllMocks();
    window.history.replaceState({}, '', '/?view=split&table=12');
  });

  it('B.1: Real-time Split View Sync - submitting diner feedback updates Admin Live Stream instantly', async () => {
    const user = userEvent.setup();

    render(<App />);

    // 1. Verify split view contains both Diner and Admin components
    expect(screen.getAllByText('#12').length).toBeGreaterThanOrEqual(1); // Table 12 in diner / select
    expect(screen.getByText(/Live Table Feedback Stream/i)).toBeInTheDocument(); // Admin dashboard stream
    expect(screen.getByText("Today's Feedbacks")).toBeInTheDocument();

    // 2. Interact with Diner side: Click "Share Your Feedback"
    const dinerStartBtn = screen.getByRole('button', { name: /Share Your Feedback/i });
    await user.click(dinerStartBtn);

    // 3. Select custom tag & type comment
    const wifiTag = screen.getByRole('button', { name: 'High-Speed WiFi 📶' });
    await user.click(wifiTag);

    const commentInput = screen.getByPlaceholderText(/Optional note for Rohan & team.../i);
    await user.type(commentInput, 'WiFi was blazing fast for my work meeting!');

    // 4. Submit feedback from Diner side
    const submitBtn = screen.getByRole('button', { name: /Submit & Reveal Perk/i });
    await user.click(submitBtn);

    // 5. Diner transitions to success screen
    await waitFor(() => {
      expect(screen.getByText(/Thank You! 🎉/i)).toBeInTheDocument();
    });

    // 6. Admin feed instantly contains the new review with Table #12 and comment
    await waitFor(() => {
      expect(
        screen.getByText(/"WiFi was blazing fast for my work meeting!"/i)
      ).toBeInTheDocument();
    });
  });

  it('C.4: Concurrency & Rapid Interaction - handles rapid actions without corrupting store', async () => {
    const user = userEvent.setup();

    render(<App />);

    // Click "Simulate Scan" in DemoBar twice in rapid succession
    const simBtn = screen.getByRole('button', { name: /Simulate Scan/i });
    await user.click(simBtn);
    await user.click(simBtn);

    // Feedbacks stream should still be valid and rendered
    await waitFor(() => {
      const feedItems = screen.getAllByText(/Table #/i);
      expect(feedItems.length).toBeGreaterThan(0);
    });
  });

  it('DemoBar navigation switches views and opens PM documentation modal', async () => {
    const user = userEvent.setup();

    render(<App />);

    // Click PM Docs in DemoBar
    const pmDocsBtn = screen.getByRole('button', { name: /PM Docs/i });
    await user.click(pmDocsBtn);

    // PM Docs modal is opened via React.lazy
    const modalHeading = await screen.findByText(/PulseQR — GTM & Product Documentation Hub/i);
    expect(modalHeading).toBeInTheDocument();
    expect(screen.getAllByText(/1\. PRD \(Product Requirements\)/i).length).toBeGreaterThanOrEqual(1);

    // Close button inside the modal header
    const closeBtn = modalHeading.closest('.flex.items-center.justify-between').querySelector('button');
    await user.click(closeBtn);

    await waitFor(() => {
      expect(screen.queryByText(/PulseQR — GTM & Product Documentation Hub/i)).not.toBeInTheDocument();
    });
  });
});
