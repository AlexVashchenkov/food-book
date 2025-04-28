/*
  Warnings:

  - You are about to drop the `_DishToIngredient` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `Ingredient` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "_DishToIngredient" DROP CONSTRAINT "_DishToIngredient_A_fkey";

-- DropForeignKey
ALTER TABLE "_DishToIngredient" DROP CONSTRAINT "_DishToIngredient_B_fkey";

-- AlterTable
ALTER TABLE "Dish" ALTER COLUMN "photo" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "photo" DROP NOT NULL,
ALTER COLUMN "photo" SET DATA TYPE TEXT;

-- DropTable
DROP TABLE "_DishToIngredient";

-- CreateTable
CREATE TABLE "_DishIngredients" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_DishIngredients_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_DishIngredients_B_index" ON "_DishIngredients"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Ingredient_name_key" ON "Ingredient"("name");

-- AddForeignKey
ALTER TABLE "_DishIngredients" ADD CONSTRAINT "_DishIngredients_A_fkey" FOREIGN KEY ("A") REFERENCES "Dish"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DishIngredients" ADD CONSTRAINT "_DishIngredients_B_fkey" FOREIGN KEY ("B") REFERENCES "Ingredient"("id") ON DELETE CASCADE ON UPDATE CASCADE;
