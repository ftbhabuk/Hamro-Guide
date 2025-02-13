// // src/constants/tripConstants.tsx
// import { Coins, Users, Heart } from 'lucide-react';
// import { Input } from '@/components/ui/input';
// import { IconType } from 'lucide-react';
// // import { DevDestinationInputProps } from '@/types/trip';

// interface BudgetOption {
//   level: string;
//   range: string;
// }

// interface CompanionOption {
//   type: string;
//   icon: IconType;
//   description: string;
// }

// export const budgetOptions: BudgetOption[] = [
//   { level: 'Low', range: '0 - 1000 NRP' },
//   { level: 'Medium', range: '1000 - 2500 NRP' },
//   { level: 'High', range: '2500+ NRP' },
// ];

// export const companionOptions: CompanionOption[] = [
//   { type: 'Solo', icon: Users, description: 'Traveling alone' },
//   { type: 'Family', icon: Users, description: 'With family members' },
//   { type: 'Friends', icon: Users, description: 'With a group of friends' },
//   { type: 'Couple', icon: Heart, description: 'Romantic getaway' },
//   { type: 'Business', icon: Users, description: 'Business trip' },
//   { type: 'Group Tour', icon: Users, description: 'Organized tour group' },
// ];

// export const activities: string[] = [
//   'Cultural', 'Adventure', 'Relaxation', 'Shopping',
//   'Food & Dining', 'Nature', 'Historical', 'Nightlife',
// ];

// export const DevDestinationInput: React.FC<DevDestinationInputProps> = ({ setDestination }) => (
//   <Input
//     type="text"
//     className="w-full h-12"
//     placeholder="Enter destination (Development mode)"
//     onChange={(e) => setDestination({ label: e.target.value, value: e.target.value })}
//   />
// );
