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
        image: 'https://www.canon.com.au/-/media/images/canon/products/eos-r5/eos-r5-body-front.png'
    },
    {
        id: 'canon-eos-m50-mark-ii',
        name: 'Canon EOS M50 Mark II',
        brand: 'Canon',
        price: 779,
        megapixels: 24,
        sensor: 'APS-C',
        image: 'https://www.canon-europe.com/media/eos-m50-mark-ii_1240x620.png'
    },
    {
        id: 'sony-a7-v',
        name: 'Sony Alpha 7 V',
        brand: 'Sony',
        price: 2899,
        megapixels: 33,
        sensor: 'Full Frame',
        image: 'https://www.sony.com/image/sony-a7v-mirrorless-camera.png'
    },
    {
        id: 'sony-a6400',
        name: 'Sony Alpha a6400',
        brand: 'Sony',
        price: 898,
        megapixels: 24,
        sensor: 'APS-C',
        image: 'https://www.sony.com/image/sony-a6400-body.png'
    },
    {
        id: 'nikon-z6-ii',
        name: 'Nikon Z6 II',
        brand: 'Nikon',
        price: 1999,
        megapixels: 24,
        sensor: 'Full Frame',
        image: 'https://cdn.nikonimg.com/products/nikon-z6-ii-front.png'
    },
    {
        id: 'nikon-z8',
        name: 'Nikon Z8',
        brand: 'Nikon',
        price: 3999,
        megapixels: 45,
        sensor: 'Full Frame',
        image: 'https://cdn.nikonimg.com/products/nikon-z8-body.png'
    },
    {
        id: 'fujifilm-x-t5',
        name: 'Fujifilm X-T5',
        brand: 'Fujifilm',
        price: 1699,
        megapixels: 40,
        sensor: 'APS-C',
        image: 'https://fujifilm-x.com/images/products/x-t5_front.png'
    },
    {
        id: 'fujifilm-x100vi',
        name: 'Fujifilm X100VI',
        brand: 'Fujifilm',
        price: 1599,
        megapixels: 40,
        sensor: 'APS-C',
        image: 'https://fujifilm-x.com/images/products/x100vi_black.png'
    },
    {
        id: 'panasonic-lumix-gh6',
        name: 'Panasonic Lumix GH6',
        brand: 'Panasonic',
        price: 2199,
        megapixels: 25,
        sensor: 'MFT',
        image: 'https://www.panasonic.com/images/lumix-gh6-front.png'
    },
    {
        id: 'om-system-om-1',
        name: 'OM System OM-1',
        brand: 'OM System',
        price: 2199,
        megapixels: 20,
        sensor: 'MFT',
        image: 'https://www.om-system.com/images/om-1-front.png'
    },
    {
        id: 'leica-q3',
        name: 'Leica Q3',
        brand: 'Leica',
        price: 5995,
        megapixels: 60,
        sensor: 'Full Frame',
        image: 'https://us.leica-camera.com/media/leica-q3-product-line.png'
    },
    {
        id: 'pentax-k-3-mark-iii',
        name: 'Pentax K-3 Mark III',
        brand: 'Pentax',
        price: 1799,
        megapixels: 26,
        sensor: 'APS-C',
        image: 'https://www.ricoh-imaging.co.jp/images/pentax-k-3-iii-body.png'
    },
    {
        id: 'canon-eos-r6-mark-ii',
        name: 'Canon EOS R6 Mark II',
        brand: 'Canon',
        price: 2499,
        megapixels: 24,
        sensor: 'Full Frame',
        image: 'https://www.canon.com.au/-/media/images/canon/products/eos-r6-mark-ii/eos-r6-mark-ii-front.png'
    }
]

async function main() {
    await db.delete(cameraTable)
    console.log('deleted old data')

    await db.insert(cameraTable).values(data)
    console.log('inserted data')
}

main()
