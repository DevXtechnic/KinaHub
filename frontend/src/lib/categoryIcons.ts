import {
  BookOpen,
  Bike,
  Camera,
  Dumbbell,
  Gamepad2,
  Headphones,
  Home as HomeIcon,
  Laptop,
  NotebookPen,
  PlugZap,
  PawPrint,
  Recycle,
  GraduationCap,
  Shirt,
  ShoppingBasket,
  Smartphone,
  Sparkles,
  Cable,
  Wifi,
} from 'lucide-react';

const categoryIconMap = {
  mobiles: Smartphone,
  laptops: Laptop,
  accessories: Cable,
  audio: Headphones,
  fashion: Shirt,
  home: HomeIcon,
  beauty: Sparkles,
  groceries: ShoppingBasket,
  gaming: Gamepad2,
  networking: Wifi,
  appliances: PlugZap,
  sports: Dumbbell,
  books: BookOpen,
  cameras: Camera,
  school: GraduationCap,
  stationery: NotebookPen,
  pets: PawPrint,
  'automotive-bikes': Bike,
  'eco-sustainable': Recycle,
};

export function getCategoryIcon(slug: string) {
  return categoryIconMap[slug as keyof typeof categoryIconMap] || ShoppingBasket;
}
