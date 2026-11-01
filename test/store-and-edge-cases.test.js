import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getStoredSettings,
  saveSettings,
  getStoredFeedbacks,
  addFeedback,
  updateFeedbackStatus,
  resetToSeedData,
} from '../src/data/store';
import { INITIAL_SETTINGS } from '../src/data/mockData';

describe('PulseQR Data Store & Edge Cases', () => {
  beforeEach(() => {
    localStorage.clear();
    resetToSeedData();
  });

  describe('Section C.1: Offline & Storage Quota Errors', () => {
    it('gracefully handles localStorage failures without crashing', () => {
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = vi.fn(() => {
        throw new Error('QuotaExceededError: DOM Exception 22');
      });

      expect(() => {
        saveSettings({ ...INITIAL_SETTINGS, cafeName: 'Fallback Cafe' });
      }).not.toThrow();

      expect(() => {
        addFeedback({
          table: '02',
          ratings: { food: 5, service: 5, ambiance: 5 },
          comment: 'Testing quota error',
        });
      }).not.toThrow();

      localStorage.setItem = originalSetItem;
    });

    it('falls back to default settings when localStorage returns corrupted JSON', () => {
      localStorage.setItem('pulseqr_settings_v1', 'NOT_VALID_JSON{[');
      // Reset module cached settings by re-reading corrupted value
      const settings = getStoredSettings();
      expect(settings).toBeDefined();
      expect(settings.cafeName).toBe(INITIAL_SETTINGS.cafeName);
    });

    it('falls back to default feedbacks when localStorage returns invalid data', () => {
      localStorage.setItem('pulseqr_feedbacks_v1', 'corrupted_json');
      const feedbacks = getStoredFeedbacks();
      expect(Array.isArray(feedbacks)).toBe(true);
      expect(feedbacks.length).toBeGreaterThan(0);
    });
  });

  describe('Section C.2: Alert Threshold Boundary (<= 2)', () => {
    it('triggers isAlert=true when food rating is exactly equal to threshold (2)', () => {
      const entry = addFeedback({
        table: '04',
        ratings: { food: 2, service: 4, ambiance: 4 },
        comment: 'Food was lukewarm',
      });

      expect(entry[0].isAlert).toBe(true);
      expect(entry[0].status).toBe('ALERT_TRIGGERED');
    });

    it('triggers isAlert=true when overall score is <= threshold (2)', () => {
      const entry = addFeedback({
        table: '04',
        ratings: { food: 2, service: 2, ambiance: 2 },
        comment: 'Bad overall experience',
      });

      expect(entry[0].overallScore).toBe(2);
      expect(entry[0].isAlert).toBe(true);
      expect(entry[0].status).toBe('ALERT_TRIGGERED');
    });

    it('does NOT trigger alert when all ratings are strictly greater than threshold (> 2)', () => {
      const entry = addFeedback({
        table: '04',
        ratings: { food: 3, service: 3, ambiance: 3 },
        comment: 'Decent experience',
      });

      expect(entry[0].overallScore).toBe(3);
      expect(entry[0].isAlert).toBe(false);
      expect(entry[0].status).toBe('ACKNOWLEDGED');
    });
  });

  describe('Section C.3: Long Comments Layout & Input Sanitization', () => {
    it('truncates excessively long comments to 500 characters', () => {
      const longComment = 'A'.repeat(800);
      const entry = addFeedback({
        table: '05',
        ratings: { food: 4, service: 4, ambiance: 4 },
        comment: longComment,
      });

      expect(entry[0].comment.length).toBe(500);
      expect(entry[0].comment).toBe('A'.repeat(500));
    });

    it('clamps ratings to range 1-5 even if malicious inputs provided', () => {
      const entry = addFeedback({
        table: '06',
        ratings: { food: 999, service: -50, ambiance: 'not-a-number' },
        comment: 'Fuzzed ratings',
      });

      expect(entry[0].ratings.food).toBe(5);
      expect(entry[0].ratings.service).toBe(1);
      expect(entry[0].ratings.ambiance).toBe(3); // fallback for NaN
    });

    it('limits tags to maximum of 10 tags and sanitizes strings', () => {
      const excessiveTags = Array.from({ length: 25 }, (_, i) => `Tag-${i}`);
      const entry = addFeedback({
        table: '08',
        ratings: { food: 5, service: 5, ambiance: 5 },
        tags: excessiveTags,
      });

      expect(entry[0].tags.length).toBe(10);
    });
  });

  describe('Section B.6: Incident Resolution Workflow', () => {
    it('updates feedback status to RESOLVED and records resolution note', () => {
      const newFeedbacks = addFeedback({
        table: '03',
        ratings: { food: 1, service: 1, ambiance: 1 },
        comment: 'Spilled coffee',
      });

      const alertItem = newFeedbacks[0];
      expect(alertItem.status).toBe('ALERT_TRIGGERED');

      const updatedList = updateFeedbackStatus(
        alertItem.id,
        'RESOLVED',
        'Comped entire bill and provided fresh dessert'
      );

      const resolvedItem = updatedList.find((f) => f.id === alertItem.id);
      expect(resolvedItem.status).toBe('RESOLVED');
      expect(resolvedItem.resolutionNote).toBe('Comped entire bill and provided fresh dessert');
    });
  });
});
