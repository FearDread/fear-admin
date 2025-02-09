const {seedBrand}=require("../fdata/brand")
const {seedCategory}=require("../fdata/category")
const {seedProduct}=require("../fdata/product")
const {seedUser}=require("../fdata/user")
const {seedAddress}=require("../fdata/address")
const {seedWishlist}=require("../fdata/wishlist")
const {seedCart}=require("../fdata/cart")
const {seedReview}=require("../fdata/review")
const {seedOrder}=require("../fdata/order")
const {connectToDB}=require("../database/db")

const seedData=async()=>{
    try {
        await connectToDB()
        console.log('Seed [started] please wait..');
        await seedBrand()
        await seedCategory()
        await seedProduct()
        await seedUser()
        await seedAddress()
        await seedWishlist()
        await seedCart()
        await seedReview()
        await seedOrder()

        console.log('Seed completed..');
    } catch (error) {
        console.log(error);
    }
}

seedData()