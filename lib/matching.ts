import { BloodGroup } from '@/types/database';

/**
 * Blood group compatibility matrix
 * Returns array of blood groups that can donate to the recipient
 */
export function getCompatibleDonors(recipientBloodGroup: BloodGroup): BloodGroup[] {
  const compatibility: Record<BloodGroup, BloodGroup[]> = {
    'A+': ['A+', 'A-', 'O+', 'O-'],
    'A-': ['A-', 'O-'],
    'B+': ['B+', 'B-', 'O+', 'O-'],
    'B-': ['B-', 'O-'],
    'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], // Universal recipient
    'AB-': ['A-', 'B-', 'AB-', 'O-'],
    'O+': ['O+', 'O-'],
    'O-': ['O-'], // Universal donor (only O- can donate to O-)
  };

  return compatibility[recipientBloodGroup] || [];
}

/**
 * Calculate distance priority score
 * Same thana = 3, Same district = 2, Same division = 1, Different = 0
 */
export function calculateLocationScore(
  donorLocation: { division: string; district: string; thana: string },
  requestLocation: { division: string; district: string; thana: string }
): number {
  if (donorLocation.thana === requestLocation.thana) return 3;
  if (donorLocation.district === requestLocation.district) return 2;
  if (donorLocation.division === requestLocation.division) return 1;
  return 0;
}

/**
 * Calculate priority boost for rare blood groups
 * Negative blood groups get higher priority
 */
export function getRarityBoost(bloodGroup: BloodGroup): number {
  const rareBloodGroups: BloodGroup[] = ['AB-', 'B-', 'A-', 'O-'];
  return rareBloodGroups.includes(bloodGroup) ? 2 : 0;
}

/**
 * Calculate overall donor match score
 * Higher score = better match
 */
export function calculateDonorScore(
  donor: {
    bloodGroup: BloodGroup;
    location: { division: string; district: string; thana: string };
    totalDonations: number;
  },
  request: {
    bloodGroup: BloodGroup;
    location: { division: string; district: string; thana: string };
  }
): number {
  let score = 0;

  // Location proximity (0-3 points)
  score += calculateLocationScore(donor.location, request.location);

  // Rarity boost for negative blood (0-2 points)
  score += getRarityBoost(donor.bloodGroup);

  // Experience boost (0-1 point for 5+ donations)
  if (donor.totalDonations >= 5) {
    score += 1;
  }

  return score;
}
