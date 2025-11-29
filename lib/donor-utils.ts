import { addDays, differenceInDays } from 'date-fns';

// Standard cooldown period between blood donations (in days)
export const DONATION_COOLDOWN_DAYS = 56; // 8 weeks

/**
 * Check if a donor is eligible to donate based on their last donation date
 */
export function isDonorEligible(lastDonationDate: Date | string | null | undefined): boolean {
  if (!lastDonationDate) {
    return true; // Never donated before, eligible
  }

  const lastDonation = new Date(lastDonationDate);
  const daysSinceLastDonation = differenceInDays(new Date(), lastDonation);
  
  return daysSinceLastDonation >= DONATION_COOLDOWN_DAYS;
}

/**
 * Calculate days remaining until donor is eligible again
 */
export function getDaysUntilEligible(lastDonationDate: Date | string | null | undefined): number {
  if (!lastDonationDate) {
    return 0; // Never donated, no cooldown
  }

  const lastDonation = new Date(lastDonationDate);
  const daysSinceLastDonation = differenceInDays(new Date(), lastDonation);
  const daysRemaining = DONATION_COOLDOWN_DAYS - daysSinceLastDonation;
  
  return Math.max(0, daysRemaining);
}

/**
 * Get the next eligible donation date
 */
export function getNextEligibleDate(lastDonationDate: Date | string | null | undefined): Date | null {
  if (!lastDonationDate) {
    return null; // Never donated, eligible now
  }

  const lastDonation = new Date(lastDonationDate);
  return addDays(lastDonation, DONATION_COOLDOWN_DAYS);
}

/**
 * Get formatted cooldown status message
 */
export function getCooldownStatusMessage(lastDonationDate: Date | string | null | undefined): {
  status: 'eligible' | 'cooldown';
  message: string;
  daysRemaining: number;
} {
  const daysRemaining = getDaysUntilEligible(lastDonationDate);
  
  if (daysRemaining === 0) {
    return {
      status: 'eligible',
      message: 'Ready to save lives!',
      daysRemaining: 0,
    };
  }

  const nextDate = getNextEligibleDate(lastDonationDate);
  const dateStr = nextDate ? nextDate.toLocaleDateString('en-GB') : '';
  
  return {
    status: 'cooldown',
    message: `Eligible in ${daysRemaining} day${daysRemaining === 1 ? '' : 's'}`,
    daysRemaining,
  };
}
