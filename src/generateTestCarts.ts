import { db } from "./firebase";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";

const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const generateTestCart = async (userId: string) => {
  try {
    const productsSnapshot = await getDocs(collection(db, "products"));
    const products = productsSnapshot.docs.map((doc) => ({ id: doc.data().id }));

    if (products.length === 0) {
      console.log("❌ Nincsenek termékek.");
      return;
    }

    const itemsCount = getRandomInt(3, 5);
    const selectedItems = [];

    for (let i = 0; i < itemsCount; i++) {
      const randomProduct = products[getRandomInt(0, products.length - 1)];
      selectedItems.push({
        productId: randomProduct.id,
        quantity: getRandomInt(1, 3),
      });
    }

    await setDoc(doc(db, "carts", userId), {
      userId,
      items: selectedItems,
      updatedAt: new Date(),
    });

    console.log(`✅ Kosár létrehozva (${userId}):`, selectedItems);
  } catch (error) {
    console.error("❌ Hiba:", error);
  }
};

const userId = "user123";
generateTestCart(userId);
