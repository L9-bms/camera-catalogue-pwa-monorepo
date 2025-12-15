import openapi, { fromTypes } from '@elysiajs/openapi'

export const oapi = openapi({
    references: fromTypes(
        process.env.NODE_ENV === 'production'
            ? 'dist/src/index.d.ts'
            : 'src/index.ts'
    ),
    documentation: {
        info: {
            title: 'Camera Catalogue API',
            description: 'Documentation for Camera Catalogue API',
            version: '1.0.0'
        },
        servers: [
            {
                url: 'https://swe.callumwong.com/api'
            },
            {
                url: 'http://localhost:3001'
            }
        ]
    }
})
