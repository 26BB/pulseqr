import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DinerView from '../src/components/diner/DinerView';
import { INITIAL_SETTINGS } from '../src/data/mockData';

// Mock canvas-confetti
vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

describe('Section A: Diner Flow Tests', () => {
  const mockSettings = {
    ...INITIAL_SETTINGS,
    cafeName: 'Brew & Beans',
    discountCode: 'PULSE10',
    alertThreshold: 2,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('A.1: URL Parameter Reading - renders correct table number in header and badge', () => {
    render(
      <DinerView
        table="07"
        settings={mockSettings}
        onSubmitFeedback={vi.fn()}
      />
    );

    // Verify table number displayed in header badge
    expect(screen.getByText('#07')).toBeInTheDocument();
    expect(screen.getByText('Brew & Beans')).toBeInTheDocument();
  });

  it('A.2: Rating Submission & Navigation - transitions through welcome -> form -> success', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    render(
      <DinerView
        table="04"
        settings={mockSettings}
        onSubmitFeedback={handleSubmit}
      />
    );

    // 1. Welcome screen
    expect(screen.getByText(/How was your experience at Brew & Beans\?/i)).toBeInTheDocument();
    const startBtn = screen.getByRole('button', { name: /Share Your Feedback/i });
    await user.click(startBtn);

    // 2. Form screen
    expect(screen.getByText(/Rate your visit:/i)).toBeInTheDocument();
    expect(screen.getByText(/Coffee & Food Taste/i)).toBeInTheDocument();

    // 3. Submit
    const submitBtn = screen.getByRole('button', { name: /Submit & Reveal Perk/i });
    await user.click(submitBtn);

    // 4. Success screen
    expect(screen.getByText(/Thank You! 🎉/i)).toBeInTheDocument();
    expect(screen.getByText(/PULSE10/i)).toBeInTheDocument();
    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });

  it('A.3: Tag Selection & Comment Entry - accurately passes selected tags and text payload', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    render(
      <DinerView
        table="07"
        settings={mockSettings}
        onSubmitFeedback={handleSubmit}
      />
    );

    // Go to form
    await user.click(screen.getByRole('button', { name: /Share Your Feedback/i }));

    // Click tags
    const oatMilkTag = screen.getByRole('button', { name: 'Oat Milk 🥛' });
    const fastBaristaTag = screen.getByRole('button', { name: 'Fast Barista ⚡' });

    await user.click(oatMilkTag);
    await user.click(fastBaristaTag);

    // Type comment
    const input = screen.getByPlaceholderText(/Optional note for Rohan & team.../i);
    await user.type(input, 'Super fast service and great latte art!');

    // Submit
    await user.click(screen.getByRole('button', { name: /Submit & Reveal Perk/i }));

    expect(handleSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        table: '07',
        comment: 'Super fast service and great latte art!',
        tags: expect.arrayContaining(['Oat Milk 🥛', 'Fast Barista ⚡']),
        guestName: 'Guest (Table 07)',
      })
    );
  });

  it('A.4: Coupon Copy Action - copies discount code to clipboard and updates UI state', async () => {
    const user = userEvent.setup();
    const writeTextSpy = vi.spyOn(navigator.clipboard, 'writeText');

    render(
      <DinerView
        table="04"
        settings={mockSettings}
        onSubmitFeedback={vi.fn()}
      />
    );

    // Move to success screen
    await user.click(screen.getByRole('button', { name: /Share Your Feedback/i }));
    await user.click(screen.getByRole('button', { name: /Submit & Reveal Perk/i }));

    // Verify copy button
    const copyBtn = screen.getByRole('button', { name: /Copy Code to Show Server/i });
    await user.click(copyBtn);

    expect(writeTextSpy).toHaveBeenCalledWith('PULSE10');
    expect(screen.getByText(/Copied to Clipboard!/i)).toBeInTheDocument();
  });

  it('A.5: Confetti Trigger on Happy Path & Alert Banner on Low Rating Unhappy Path', async () => {
    const user = userEvent.setup();
    const confettiModule = await import('canvas-confetti');
    const confettiSpy = vi.spyOn(confettiModule, 'default');

    // 1. Happy path (ratings default to 5, 5, 4 > 2)
    const { unmount } = render(
      <DinerView
        table="04"
        settings={mockSettings}
        onSubmitFeedback={vi.fn()}
      />
    );

    await user.click(screen.getByRole('button', { name: /Share Your Feedback/i }));
    await user.click(screen.getByRole('button', { name: /Submit & Reveal Perk/i }));

    await waitFor(() => {
      expect(confettiSpy).toHaveBeenCalled();
    });
    expect(screen.queryByText(/Instant WhatsApp Alert Dispatched/i)).not.toBeInTheDocument();

    unmount();
    vi.clearAllMocks();

    // 2. Unhappy path: Low rating (food = 1 <= threshold 2)
    render(
      <DinerView
        table="09"
        settings={mockSettings}
        onSubmitFeedback={vi.fn()}
      />
    );

    await user.click(screen.getByRole('button', { name: /Share Your Feedback/i }));

    // Click terrible rating for food
    const terribleButtons = screen.getAllByRole('button', { name: 'Terrible' });
    await user.click(terribleButtons[0]); // first category is food

    await user.click(screen.getByRole('button', { name: /Submit & Reveal Perk/i }));

    // Confetti should NOT be fired
    expect(confettiSpy).not.toHaveBeenCalled();

    // Alert banner should appear
    expect(screen.getByText(/Instant WhatsApp Alert Dispatched/i)).toBeInTheDocument();
    expect(screen.getByText(/Rohan & Floor Lead have been alerted about Table #09/i)).toBeInTheDocument();
  });

  it('allows restarting feedback after viewing the success screen', async () => {
    const user = userEvent.setup();

    render(
      <DinerView
        table="04"
        settings={mockSettings}
        onSubmitFeedback={vi.fn()}
      />
    );

    await user.click(screen.getByRole('button', { name: /Share Your Feedback/i }));
    await user.click(screen.getByRole('button', { name: /Submit & Reveal Perk/i }));

    const resetBtn = screen.getByRole('button', { name: /Submit another test response/i });
    await user.click(resetBtn);

    expect(screen.getByText(/How was your experience at Brew & Beans\?/i)).toBeInTheDocument();
  });
});
