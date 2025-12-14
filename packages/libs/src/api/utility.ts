import { Treaty } from '@elysiajs/eden'
import { api } from '.'

// https://elysiajs.com/eden/treaty/response.html#utility-type

export type BrandsData = Treaty.Data<typeof api.cameras.brands.get>
export type SensorsData = Treaty.Data<typeof api.cameras.sensors.get>
export type CamerasData = Treaty.Data<typeof api.cameras.get>
export type CameraSearchData = Treaty.Data<typeof api.cameras.search.get>
