import {Redis} from '@upstash/redis'

export const db = new Redis({
    url: 'https://apn1-vast-cockatoo-34305.upstash.io',
    token: 'AYYBASQgMjAzOTMxMDUtMjk5MC00MTgzLWE2YzUtMDhlNjMwYWJmM2I5MzFmZGY5YWNhMWZhNGEwZWE2Njg3Nzk1MmM4MjBjNDI='
})
