/**
 * EventFlow AI — Live Venue Data Simulator
 * Simulates real-time sensor data from a stadium/venue
 */

export const VENUE_CONFIG = {
  name: 'Nexus Arena',
  capacity: 52000,
  event: 'TechFest 2026 — Grand Opening',
  eventDate: new Date().toISOString(),
  sections: 12,
};

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export const VENUE_ZONES = [
  { id: 'z1',  name: 'Main Gate A',        capacity: 5000, icon: '🚪', category: 'entrance'   },
  { id: 'z2',  name: 'Gate B — North',     capacity: 4500, icon: '🚪', category: 'entrance'   },
  { id: 'z3',  name: 'Gate C — VIP',       capacity: 2000, icon: '⭐', category: 'entrance'   },
  { id: 'z4',  name: 'Food Court A',       capacity: 3000, icon: '🍔', category: 'food'       },
  { id: 'z5',  name: 'Food Court B',       capacity: 2500, icon: '🍕', category: 'food'       },
  { id: 'z6',  name: 'Main Stage Area',    capacity: 15000,icon: '🎤', category: 'venue'      },
  { id: 'z7',  name: 'Exhibition Hall',    capacity: 8000, icon: '🏛️', category: 'venue'      },
  { id: 'z8',  name: 'Restrooms — Block B',capacity: 800,  icon: '🚻', category: 'facility'   },
  { id: 'z9',  name: 'Parking Lot A',      capacity: 6000, icon: '🚗', category: 'transport'  },
  { id: 'z10', name: 'Shuttle Hub',        capacity: 1500, icon: '🚌', category: 'transport'  },
  { id: 'z11', name: 'First Aid Station',  capacity: 200,  icon: '⛑️', category: 'safety'     },
  { id: 'z12', name: 'Merchandise Store',  capacity: 1200, icon: '👕', category: 'retail'     },
];

export const QUEUE_FACILITIES = [
  { id: 'q1',  name: 'Food Court A — Counter 1', zone: 'z4',  baseWait: 12 },
  { id: 'q2',  name: 'Food Court A — Counter 2', zone: 'z4',  baseWait: 8  },
  { id: 'q3',  name: 'Food Court B',             zone: 'z5',  baseWait: 5  },
  { id: 'q4',  name: 'Main Entrance Gate A',     zone: 'z1',  baseWait: 15 },
  { id: 'q5',  name: 'Gate B Security Check',    zone: 'z2',  baseWait: 7  },
  { id: 'q6',  name: 'VIP Gate C',               zone: 'z3',  baseWait: 2  },
  { id: 'q7',  name: 'Restrooms Block B',        zone: 'z8',  baseWait: 10 },
  { id: 'q8',  name: 'Merchandise Store',        zone: 'z12', baseWait: 18 },
  { id: 'q9',  name: 'Shuttle Bus Bay 1',        zone: 'z10', baseWait: 6  },
  { id: 'q10', name: 'First Aid Check-In',       zone: 'z11', baseWait: 1  },
];

export const ALERTS = [
  {
    id: 'a1',
    type: 'critical',
    zone: 'Main Gate A',
    message: 'Zone at 91% capacity. Open Gate D immediately.',
    time: '2 min ago',
    resolved: false,
  },
  {
    id: 'a2',
    type: 'warning',
    zone: 'Food Court A',
    message: 'Queue exceeding 15 min. Activate overflow counter.',
    time: '7 min ago',
    resolved: false,
  },
  {
    id: 'a3',
    type: 'info',
    zone: 'Parking Lot A',
    message: 'Lot A at 82%. Redirect arrivals to Lot B via Staff Radio.',
    time: '12 min ago',
    resolved: true,
  },
  {
    id: 'a4',
    type: 'warning',
    zone: 'Main Stage Area',
    message: 'Peak crowd predicted in 20 min — open buffer zones.',
    time: '15 min ago',
    resolved: false,
  },
];

/**
 * Generate live occupancy data for all zones with realistic variance.
 * @returns {Object[]} Live zone data array
 */
export function getLiveZoneData() {
  return VENUE_ZONES.map(zone => {
    const occupancyMap = {
      z1: rand(85, 95), z2: rand(60, 75), z3: rand(30, 50),
      z4: rand(72, 82), z5: rand(40, 60), z6: rand(65, 80),
      z7: rand(55, 70), z8: rand(68, 85), z9: rand(78, 90),
      z10: rand(45, 65),z11: rand(10, 25),z12: rand(60, 78),
    };
    const pct = occupancyMap[zone.id] || rand(40, 75);
    return {
      ...zone,
      occupancy: pct,
      count: Math.floor(zone.capacity * pct / 100),
      trend: pct > 80 ? 'rising' : pct > 60 ? 'stable' : 'falling',
      riskLevel: pct >= 90 ? 'critical' : pct >= 75 ? 'high' : pct >= 55 ? 'medium' : 'low',
    };
  });
}

/**
 * Generate live queue data for all facilities.
 * @returns {Object[]} Live queue data array
 */
export function getLiveQueueData() {
  return QUEUE_FACILITIES.map(q => {
    const variance = rand(-3, 8);
    const wait = Math.max(0, q.baseWait + variance);
    return {
      ...q,
      currentWait: wait,
      queueLength: Math.floor(wait * rand(3, 6)),
      status: wait >= 15 ? 'critical' : wait >= 10 ? 'busy' : wait >= 5 ? 'moderate' : 'clear',
      bestTime: wait >= 10 ? 'In ~30 min' : 'Now',
    };
  });
}

/**
 * Get overall venue statistics.
 * @param {Object[]} zones - Live zone data
 * @returns {Object} Venue-wide summary stats
 */
export function getVenueStats(zones) {
  const totalCount  = zones.reduce((s, z) => s + z.count, 0);
  const avgOccupancy = Math.round(zones.reduce((s, z) => s + z.occupancy, 0) / zones.length);
  const criticalZones = zones.filter(z => z.riskLevel === 'critical').length;
  const highZones     = zones.filter(z => z.riskLevel === 'high').length;
  const overallRisk   = criticalZones > 0 ? 'critical' : highZones >= 3 ? 'high' : avgOccupancy > 60 ? 'medium' : 'low';

  return {
    totalCount,
    avgOccupancy,
    criticalZones,
    highZones,
    overallRisk,
    totalCapacity: VENUE_ZONES.reduce((s, z) => s + z.capacity, 0),
  };
}

/**
 * Demo conversation history for the attendee chat.
 */
export const DEMO_CHAT_HISTORY = [
  {
    role: 'assistant',
    text: "Hey there! 👋 I'm EventFlow, your AI venue guide for **Nexus Arena**. I can tell you wait times, help you navigate, and give live crowd updates. What do you need?",
    time: '2:45 PM',
  },
];
