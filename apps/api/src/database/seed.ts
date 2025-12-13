// this scripts seeds the psql database with dummy data
// remember to run bunx drizzle-kit push to create tables

import 'dotenv/config'
import { drizzle } from 'drizzle-orm/node-postgres'
import { cameraTable } from './schema'

const db = drizzle(process.env.DATABASE_URL!)

const data = [
    {
        id: 'canon-eos-r5',
        name: 'Canon EOS R5',
        brand: 'Canon',
        price: 3899,
        megapixels: 45,
        sensor: 'Full Frame',
        image: 'https://www.canon.com.au/-/media/images/canon/products/mirrorless-cameras/eos-r5-temp/1400x960-eos-r5-body-front.ashx'
    },
    {
        id: 'canon-eos-m50-mark-ii',
        name: 'Canon EOS M50 Mark II',
        brand: 'Canon',
        price: 779,
        megapixels: 24,
        sensor: 'APS-C',
        image: 'https://www.photoreview.com.au/wp-content/uploads/2021/04/Canon-EOS-M50-Mark-II_FrontSlantLeft_M15-45_sml.jpg'
    },
    {
        id: 'sony-a7-v',
        name: 'Sony Alpha 7 V',
        brand: 'Sony',
        price: 2899,
        megapixels: 33,
        sensor: 'Full Frame',
        image: 'https://i0.wp.com/briansmith.com/wp-content/uploads/2025/12/Sony-a7V-camera-1.jpg'
    },
    {
        id: 'sony-a6400',
        name: 'Sony Alpha a6400',
        brand: 'Sony',
        price: 898,
        megapixels: 24,
        sensor: 'APS-C',
        image: 'https://www.diamondscamera.com.au/Images/ProductImages/Medium/sony-a6400-16-50mm-01.jpg'
    },
    {
        id: 'nikon-z6-ii',
        name: 'Nikon Z6 II',
        brand: 'Nikon',
        price: 1999,
        megapixels: 24,
        sensor: 'Full Frame',
        image: 'https://www.leedervillecameras.com.au/wp-content/uploads/2021/10/large_32140_yJku6G8xDIhXSBOYPt530WM4o1jCAU.jpg'
    },
    {
        id: 'nikon-z8',
        name: 'Nikon Z8',
        brand: 'Nikon',
        price: 3999,
        megapixels: 45,
        sensor: 'Full Frame',
        image: 'https://m.media-amazon.com/images/I/61gdpDwNEGL.jpg'
    },
    {
        id: 'fujifilm-x-t5',
        name: 'Fujifilm X-T5',
        brand: 'Fujifilm',
        price: 1699,
        megapixels: 40,
        sensor: 'APS-C',
        image: 'https://m.media-amazon.com/images/I/81ynTTGy+lL.jpg'
    },
    {
        id: 'fujifilm-x100vi',
        name: 'Fujifilm X100VI',
        brand: 'Fujifilm',
        price: 1599,
        megapixels: 40,
        sensor: 'APS-C',
        image: 'https://www.dpreview.com/files/p/articles/0046017017/Fujifilm_X100VI_Front.jpeg'
    },
    {
        id: 'panasonic-lumix-gh6',
        name: 'Panasonic Lumix GH6',
        brand: 'Panasonic',
        price: 2199,
        megapixels: 25,
        sensor: 'MFT',
        image: 'https://www.camera-warehouse.com.au/media/catalog/product/2/_/2_6_2_4_1.jpeg'
    },
    {
        id: 'om-system-om-1',
        name: 'OM System OM-1',
        brand: 'OM System',
        price: 2199,
        megapixels: 20,
        sensor: 'MFT',
        image: 'https://www.dpreview.com/files/p/articles/1570844542/OM_System_OM-1.jpeg'
    },
    {
        id: 'leica-q3',
        name: 'Leica Q3',
        brand: 'Leica',
        price: 5995,
        megapixels: 60,
        sensor: 'Full Frame',
        image: 'https://www.cameraelectronic.com.au/cdn/shop/files/19080_Leica_Q3_hero_plate_LoRes_RGB_1024x1024.jpg'
    },
    {
        id: 'pentax-k-3-mark-iii',
        name: 'Pentax K-3 Mark III',
        brand: 'Pentax',
        price: 1799,
        megapixels: 26,
        sensor: 'APS-C',
        image: 'https://pentax.com.au/product_image/ts1681358852/r_900x/1196/pentax-k-3-iii-dslr-monochrome-dslr-camera--body-only-.jpg'
    },
    {
        id: 'canon-eos-r6-mark-ii',
        name: 'Canon EOS R6 Mark II',
        brand: 'Canon',
        price: 2499,
        megapixels: 24,
        sensor: 'Full Frame',
        image: 'https://www.canon.com.au/-/media/images/canon/products/mirrorless-cameras/eos-r6-mark-ii/hero-image-eos-r6-mark-ii.ashx'
    }
]

async function main() {
    await db.delete(cameraTable)
    console.log('deleted old data')

    await db.insert(cameraTable).values(data)
    console.log('inserted data')
}

main()
