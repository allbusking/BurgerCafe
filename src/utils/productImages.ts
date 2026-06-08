import categoryBubbleTeaImg from "@/assets/category-bubbletea.jpg";
import categoryBurgerImg from "@/assets/category-burger.jpg";
import categoryCoffeeImg from "@/assets/category-coffee.jpg";
import categoryShawarmaImg from "@/assets/category-shawarma.jpg";
import productBeefShawarmaImg from "@/assets/product-beef-shawarma.jpg";
import productOreoCoffeeImg from "@/assets/product-oreo-coffee.jpg";
import productShawarmaImg from "@/assets/product-shawarma.jpg";
import productSmashBurgerImg from "@/assets/product-smash-burger.jpg";
import productTaroBobaImg from "@/assets/product-taro-boba.jpg";
import productTowerBurgerImg from "@/assets/product-tower-burger.jpg";

const CATEGORY_IMAGES: Record<string, string> = {
  Burgers: categoryBurgerImg,
  Shawarma: categoryShawarmaImg,
  "Bubble Tea": categoryBubbleTeaImg,
  Coffee: categoryCoffeeImg,
  "Cold Coffee": productOreoCoffeeImg,
  Combos: productTowerBurgerImg,
};

const PRODUCT_IMAGES: Record<string, string> = {
  b1: productSmashBurgerImg,
  b2: productTowerBurgerImg,
  b3: categoryBurgerImg,
  b4: productSmashBurgerImg,
  b5: categoryBurgerImg,
  b6: productTowerBurgerImg,
  s1: productShawarmaImg,
  s2: productBeefShawarmaImg,
  s3: categoryShawarmaImg,
  s4: productBeefShawarmaImg,
  t1: productTaroBobaImg,
  t2: categoryBubbleTeaImg,
  t3: productTaroBobaImg,
  t4: categoryBubbleTeaImg,
  t5: productTaroBobaImg,
  t6: categoryBubbleTeaImg,
  c1: categoryCoffeeImg,
  c2: categoryCoffeeImg,
  c3: productOreoCoffeeImg,
  c4: categoryCoffeeImg,
  cc1: productOreoCoffeeImg,
  cc2: productOreoCoffeeImg,
  cc3: categoryCoffeeImg,
  cc4: productOreoCoffeeImg,
  co1: productSmashBurgerImg,
  co2: productShawarmaImg,
  co3: productTowerBurgerImg,
  co4: categoryBurgerImg,
};

export function getProductImage(id?: string, category?: string, image?: string) {
  return (
    image ||
    (id ? PRODUCT_IMAGES[id] : undefined) ||
    (category ? CATEGORY_IMAGES[category] : undefined)
  );
}
