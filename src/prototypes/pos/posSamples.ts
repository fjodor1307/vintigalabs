// Sample wine catalog for the POS "Current Release" grid. Mirrors the Figma
// first screen (2768:1906). Photos are Unsplash wine imagery (prototype-only).

export interface PosProduct {
  id: string
  name: string
  /** Display price, e.g. "29.00 $". */
  price: string
  volume: string
  image: string
}

const WINE_PHOTOS = [
  'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1474722883778-792e7990302f?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1568213816046-0ee1c42bd559?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=400&h=400&fit=crop',
]

export const POS_PRODUCTS: PosProduct[] = [
  { id: 'p1', name: '2020 Rosé',              price: '29.00 $', volume: '750ml', image: WINE_PHOTOS[0] },
  { id: 'p2', name: 'Reserve',                price: '49.00 $', volume: '750ml', image: WINE_PHOTOS[1] },
  { id: 'p3', name: '2020 Reserve Cabernet',  price: '49.00 $', volume: '750ml', image: WINE_PHOTOS[2] },
  { id: 'p4', name: '2020 Pinot Gris',        price: '22.00 $', volume: '750ml', image: WINE_PHOTOS[3] },
  { id: 'p5', name: '2020 Reserve Chardonnay', price: '39.00 $', volume: '750ml', image: WINE_PHOTOS[1] },
  { id: 'p6', name: '2019 Chardonnay',        price: '29.00 $', volume: '750ml', image: WINE_PHOTOS[0] },
  { id: 'p7', name: '2019 Pinot Gris',        price: '26.00 $', volume: '750ml', image: WINE_PHOTOS[3] },
  { id: 'p8', name: '2020 Reserve Pinot Noir', price: '44.00 $', volume: '750ml', image: WINE_PHOTOS[2] },
]
