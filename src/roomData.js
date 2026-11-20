// Mock data for the admin Rooms view.
// Later this comes from your Java API (rooms, users and meal_skips tables).

const MEALS = ["BREAKFAST", "LUNCH", "DINNER"];

const names = [
  "Anitha", "Karthik", "Divya", "Ravi", "Meena", "Arun", "Priya", "Vignesh",
  "Kavya", "Suresh", "Nandhini", "Dinesh", "Harini", "Bala", "Swetha", "Mani",
  "Janani", "Gopi", "Lakshmi", "Naveen", "Sneha", "Prakash", "Deepa", "Vijay",
  "Pavithra",
];

// Every room holds up to 5 students
export const CAPACITY = 5;

// How many students live in each room right now
const memberCounts = {
  101: 5, 102: 5, 103: 4, 104: 5, 105: 3,
  201: 5, 202: 5, 203: 5, 204: 4, 205: 5,
  301: 5, 302: 3, 303: 5, 304: 5, 305: 4,
};

const floorLabels = ["1st floor", "2nd floor", "3rd floor"];

export const floors = [1, 2, 3].map((floor) => ({
  floor,
  label: floorLabels[floor - 1],
  rooms: [1, 2, 3, 4, 5].map((n) => {
    const room = String(floor * 100 + n);
    const roomIndex = (floor - 1) * 5 + (n - 1);

    const students = Array.from({ length: memberCounts[room] }, (_, i) => ({
      name: names[(roomIndex * 5 + i) % names.length],
      // Which of today's meals this student skipped (a made-up pattern for the demo)
      skips: MEALS.filter((_meal, m) => (Number(room) + i * 3 + m * 2) % 7 === 0),
    }));

    return { room, students };
  }),
}));

export const allRooms = floors.flatMap((f) => f.rooms);

export const TOTAL_STUDENTS = allRooms.reduce((sum, r) => sum + r.students.length, 0);

export function countSkipped(meal) {
  return allRooms.reduce(
    (sum, r) => sum + r.students.filter((s) => s.skips.includes(meal)).length,
    0
  );
}