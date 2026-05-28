import { getCurrentLocale } from '../i18n/localeStore';

export interface DeliveryMethodType {
  id: 'standard' | 'overnight';
  label: string;
  description: string;
  eta: string;
  fee: number;
}

export interface KathmanduSuggestion {
  label: string;
  area: string;
  city: string;
  aliases?: string[];
}

const deliveryMethodsByLocale: Record<'en' | 'np', DeliveryMethodType[]> = {
  en: [
    {
      id: 'standard',
      label: 'Standard delivery',
      description: 'Best for non-urgent orders inside the valley.',
      eta: '1-2 days',
      fee: 150,
    },
    {
      id: 'overnight',
      label: 'Overnight delivery',
      description: 'Faster delivery for Kathmandu Valley addresses.',
      eta: 'Next day',
      fee: 350,
    },
  ],
  np: [
    {
      id: 'standard',
      label: 'मानक डेलिभरी',
      description: 'उपत्यकाभित्रका अत्यावश्यक नभएका अर्डरका लागि उपयुक्त।',
      eta: '१-२ दिन',
      fee: 150,
    },
    {
      id: 'overnight',
      label: 'अर्को दिन डेलिभरी',
      description: 'काठमाडौं उपत्यकाका ठेगानामा अझ छिटो डेलिभरी।',
      eta: 'भोलिपल्ट',
      fee: 350,
    },
  ],
};

export function getDeliveryMethods(locale = getCurrentLocale()) {
  return deliveryMethodsByLocale[locale] || deliveryMethodsByLocale.en;
}

export const promoCodes = {
  aura10: 10,
  balensarkar12: 12,
} as const;

const kathmanduSuggestions: KathmanduSuggestion[] = [
  { label: 'Ason', area: 'Ason', city: 'Kathmandu' },
  { label: 'Bafal', area: 'Bafal', city: 'Kathmandu' },
  { label: 'Balaju', area: 'Balaju', city: 'Kathmandu' },
  { label: 'Balkhu', area: 'Balkhu', city: 'Kathmandu' },
  { label: 'Baluwatar', area: 'Baluwatar', city: 'Kathmandu' },
  { label: 'Basantapur', area: 'Basantapur', city: 'Kathmandu', aliases: ['Kathmandu Durbar Square'] },
  { label: 'Baneshwor', area: 'Baneshwor', city: 'Kathmandu', aliases: ['Old Baneshwor'] },
  { label: 'Basundhara', area: 'Basundhara', city: 'Kathmandu' },
  { label: 'Battisputali', area: 'Battisputali', city: 'Kathmandu' },
  { label: 'Bhaisipati', area: 'Bhaisipati', city: 'Lalitpur' },
  { label: 'Bhaisepati', area: 'Bhaisepati', city: 'Lalitpur', aliases: ['Bhaisipati'] },
  { label: 'Bhaktapur Durbar Square', area: 'Bhaktapur Durbar Square', city: 'Bhaktapur' },
  { label: 'Bhotahity', area: 'Bhotahity', city: 'Kathmandu' },
  { label: 'Boudha', area: 'Boudha', city: 'Kathmandu', aliases: ['Boudhanath', 'Bouddha'] },
  { label: 'Budhanilkantha', area: 'Budhanilkantha', city: 'Kathmandu' },
  { label: 'Chabahil', area: 'Chabahil', city: 'Kathmandu' },
  { label: 'Chandol', area: 'Chandol', city: 'Kathmandu' },
  { label: 'Chandragiri', area: 'Chandragiri', city: 'Kathmandu' },
  { label: 'Chapagaun', area: 'Chapagaun', city: 'Lalitpur' },
  { label: 'Chhauni', area: 'Chhauni', city: 'Kathmandu' },
  { label: 'Chhetrapati', area: 'Chhetrapati', city: 'Kathmandu' },
  { label: 'Dallu', area: 'Dallu', city: 'Kathmandu' },
  { label: 'Dhobighat', area: 'Dhobighat', city: 'Lalitpur' },
  { label: 'Dhapakhel', area: 'Dhapakhel', city: 'Lalitpur' },
  { label: 'Dhapasi', area: 'Dhapasi', city: 'Kathmandu' },
  { label: 'Dhumbarahi', area: 'Dhumbarahi', city: 'Kathmandu' },
  { label: 'Dillibazar', area: 'Dillibazar', city: 'Kathmandu' },
  { label: 'Ekantakuna', area: 'Ekantakuna', city: 'Lalitpur' },
  { label: 'Farping', area: 'Farping', city: 'Kathmandu', aliases: ['Pharping'] },
  { label: 'Gairidhara', area: 'Gairidhara', city: 'Kathmandu' },
  { label: 'Gaushala', area: 'Gaushala', city: 'Kathmandu' },
  { label: 'Ghattekulo', area: 'Ghattekulo', city: 'Kathmandu' },
  { label: 'Gongabu', area: 'Gongabu', city: 'Kathmandu', aliases: ['Gonga', 'Gongabu Bus Park', 'New Bus Park'] },
  { label: 'Gwarko', area: 'Gwarko', city: 'Lalitpur' },
  { label: 'Gyaneshwor', area: 'Gyaneshwor', city: 'Kathmandu', aliases: ['Ganeshwor', 'Gyaneshwar'] },
  { label: 'Hattiban', area: 'Hattiban', city: 'Lalitpur' },
  { label: 'Hattisar', area: 'Hattisar', city: 'Kathmandu' },
  { label: 'Imadol', area: 'Imadol', city: 'Lalitpur' },
  { label: 'Jadibuti', area: 'Jadibuti', city: 'Kathmandu' },
  { label: 'Jamal', area: 'Jamal', city: 'Kathmandu' },
  { label: 'Jawalakhel', area: 'Jawalakhel', city: 'Lalitpur' },
  { label: 'Jorpati', area: 'Jorpati', city: 'Kathmandu' },
  { label: 'Kalimati', area: 'Kalimati', city: 'Kathmandu' },
  { label: 'Kalanki', area: 'Kalanki', city: 'Kathmandu' },
  { label: 'Kamaladi', area: 'Kamaladi', city: 'Kathmandu' },
  { label: 'Kamalpokhari', area: 'Kamalpokhari', city: 'Kathmandu' },
  { label: 'Kapan', area: 'Kapan', city: 'Kathmandu' },
  { label: 'Kausaltar', area: 'Kausaltar', city: 'Bhaktapur' },
  { label: 'Khumaltar', area: 'Khumaltar', city: 'Lalitpur' },
  { label: 'Kirtipur', area: 'Kirtipur', city: 'Kathmandu' },
  { label: 'Koteshwor', area: 'Koteshwor', city: 'Kathmandu' },
  { label: 'Kupondole', area: 'Kupondole', city: 'Lalitpur' },
  { label: 'Lainchaur', area: 'Lainchaur', city: 'Kathmandu' },
  { label: 'Lalitpur', area: 'Lalitpur', city: 'Lalitpur', aliases: ['Patan'] },
  { label: 'Lazimpat', area: 'Lazimpat', city: 'Kathmandu' },
  { label: 'Lagankhel', area: 'Lagankhel', city: 'Lalitpur' },
  { label: 'Lubhu', area: 'Lubhu', city: 'Lalitpur' },
  { label: 'Maharajgunj', area: 'Maharajgunj', city: 'Kathmandu' },
  { label: 'Maitidevi', area: 'Maitidevi', city: 'Kathmandu' },
  { label: 'Mangal Bazaar', area: 'Mangal Bazaar', city: 'Lalitpur' },
  { label: 'Min Bhawan', area: 'Min Bhawan', city: 'Kathmandu', aliases: ['Minbhawan'] },
  { label: 'Nakkhu', area: 'Nakkhu', city: 'Lalitpur' },
  { label: 'Nakhipot', area: 'Nakhipot', city: 'Lalitpur' },
  { label: 'Naxal', area: 'Naxal', city: 'Kathmandu' },
  { label: 'Nayabazar', area: 'Nayabazar', city: 'Kathmandu', aliases: ['Naya Bazar'] },
  { label: 'New Baneshwor', area: 'New Baneshwor', city: 'Kathmandu' },
  { label: 'New Road', area: 'New Road', city: 'Kathmandu' },
  { label: 'Old Baneshwor', area: 'Old Baneshwor', city: 'Kathmandu' },
  { label: 'Pashupatinath', area: 'Pashupatinath', city: 'Kathmandu' },
  { label: 'Patan', area: 'Patan', city: 'Lalitpur', aliases: ['Lalitpur'] },
  { label: 'Pepsicola', area: 'Pepsicola', city: 'Kathmandu' },
  { label: 'Panga', area: 'Panga', city: 'Kathmandu' },
  { label: 'Pulchowk', area: 'Pulchowk', city: 'Lalitpur' },
  { label: 'Putalisadak', area: 'Putalisadak', city: 'Kathmandu' },
  { label: 'Ranibari', area: 'Ranibari', city: 'Kathmandu' },
  { label: 'Ratnapark', area: 'Ratnapark', city: 'Kathmandu', aliases: ['Ratna Park'] },
  { label: 'Sankhu', area: 'Sankhu', city: 'Kathmandu' },
  { label: 'Sanepa', area: 'Sanepa', city: 'Lalitpur' },
  { label: 'Sankhamul', area: 'Sankhamul', city: 'Kathmandu' },
  { label: 'Sano Thimi', area: 'Sano Thimi', city: 'Bhaktapur' },
  { label: 'Satdobato', area: 'Satdobato', city: 'Lalitpur' },
  { label: 'Sinamangal', area: 'Sinamangal', city: 'Kathmandu' },
  { label: 'Sitapaila', area: 'Sitapaila', city: 'Kathmandu' },
  { label: 'Sorhakhutte', area: 'Sorhakhutte', city: 'Kathmandu', aliases: ['Sorakhutte'] },
  { label: 'Sundhara', area: 'Sundhara', city: 'Kathmandu' },
  { label: 'Swayambhu', area: 'Swayambhu', city: 'Kathmandu', aliases: ['Swoyambhu', 'Swayambhunath'] },
  { label: 'Suryabinayak', area: 'Suryabinayak', city: 'Bhaktapur' },
  { label: 'Tahachal', area: 'Tahachal', city: 'Kathmandu' },
  { label: 'Tangal', area: 'Tangal', city: 'Kathmandu' },
  { label: 'Teku', area: 'Teku', city: 'Kathmandu' },
  { label: 'Thamel', area: 'Thamel', city: 'Kathmandu' },
  { label: 'Thapathali', area: 'Thapathali', city: 'Kathmandu' },
  { label: 'Thecho', area: 'Thecho', city: 'Lalitpur' },
  { label: 'Tinkune', area: 'Tinkune', city: 'Kathmandu' },
  { label: 'Tokha', area: 'Tokha', city: 'Kathmandu' },
  { label: 'Tripureshwor', area: 'Tripureshwor', city: 'Kathmandu' },
  { label: 'Tusal', area: 'Tusal', city: 'Kathmandu' },
  { label: 'Tyagal', area: 'Tyagal', city: 'Lalitpur' },
  { label: 'UN Park', area: 'UN Park', city: 'Lalitpur' },
];

const legacyKathmanduSuggestions: KathmanduSuggestion[] = [
  { label: 'Gongabu', area: 'Gongabu', city: 'Kathmandu' },
  { label: 'Balaju', area: 'Balaju', city: 'Kathmandu' },
  { label: 'Kalanki', area: 'Kalanki', city: 'Kathmandu' },
  { label: 'Baneshwor', area: 'Baneshwor', city: 'Kathmandu' },
  { label: 'New Baneshwor', area: 'New Baneshwor', city: 'Kathmandu' },
  { label: 'Koteshwor', area: 'Koteshwor', city: 'Kathmandu' },
  { label: 'Maharajgunj', area: 'Maharajgunj', city: 'Kathmandu' },
  { label: 'Chabahil', area: 'Chabahil', city: 'Kathmandu' },
  { label: 'Samakhushi', area: 'Samakhushi', city: 'Kathmandu' },
  { label: 'Basundhara', area: 'Basundhara', city: 'Kathmandu' },
  { label: 'Boudha', area: 'Boudha', city: 'Kathmandu' },
  { label: 'Thamel', area: 'Thamel', city: 'Kathmandu' },
  { label: 'Dillibazar', area: 'Dillibazar', city: 'Kathmandu' },
  { label: 'Putalisadak', area: 'Putalisadak', city: 'Kathmandu' },
  { label: 'Kapan', area: 'Kapan', city: 'Kathmandu' },
  { label: 'Naxal', area: 'Naxal', city: 'Kathmandu' },
  { label: 'Sundhara', area: 'Sundhara', city: 'Kathmandu' },
  { label: 'Balkhu', area: 'Balkhu', city: 'Kathmandu' },
  { label: 'Teku', area: 'Teku', city: 'Kathmandu' },
  { label: 'Jawalakhel', area: 'Jawalakhel', city: 'Lalitpur' },
  { label: 'Kupondole', area: 'Kupondole', city: 'Lalitpur' },
  { label: 'Patan', area: 'Patan', city: 'Lalitpur' },
  { label: 'Sallaghari', area: 'Sallaghari', city: 'Bhaktapur' },
  { label: 'Suryabinayak', area: 'Suryabinayak', city: 'Bhaktapur' },
  { label: 'Tokha', area: 'Tokha', city: 'Kathmandu' },
  { label: 'Dhapasi', area: 'Dhapasi', city: 'Kathmandu' },
  { label: 'Maitidevi', area: 'Maitidevi', city: 'Kathmandu' },
  { label: 'Gyaneshwor', area: 'Gyaneshwor', city: 'Kathmandu' },
  { label: 'Lazimpat', area: 'Lazimpat', city: 'Kathmandu' },
  { label: 'Pashupatinath', area: 'Pashupatinath', city: 'Kathmandu' },
];

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '');
}

export function getKathmanduSuggestions(query: string) {
  const normalizedQuery = normalize(query.trim());
  if (!normalizedQuery) return [];

  return [...kathmanduSuggestions, ...legacyKathmanduSuggestions]
    .filter((item) => {
      const haystack = `${item.label} ${item.area} ${item.city} ${(item.aliases || []).join(' ')}`;
      const normalizedHaystack = normalize(haystack);
      return normalizedHaystack.includes(normalizedQuery) || normalizedQuery.includes(normalizedHaystack);
    })
    .filter((item, index, items) => items.findIndex((other) => other.label === item.label && other.city === item.city) === index)
    .slice(0, 10);
}

export function resolvePromoCode(code: string) {
  const normalized = code.trim().toLowerCase();
  const discountPercent = promoCodes[normalized as keyof typeof promoCodes] || 0;

  return {
    code: normalized,
    discountPercent,
    valid: discountPercent > 0,
  };
}
