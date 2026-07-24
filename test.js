import { sleep } from "k6"
import http from "k6/http"

export const options = {
    vus : 1000,
    duration : "30s"
}

export default function () {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjY5ZmEyNTAzZjE1YmVjYjk5NmI1OTllMSIsIm5hbWUiOiJza3VsbGdhbSIsImVtYWlsIjoic2t1bGxnYW1pbmc2NzdAZ21haWwuY29tIiwiY3JlYXRlZEF0IjoiMjAyNi0wNS0wNVQxNzoxMjozNS4wNTRaIiwidXBkYXRlZEF0IjoiMjAyNi0wNS0wNVQxNzoxMjozNS4wNTRaIiwiX192IjowLCJpc0FkbWluIjp0cnVlfSwiaWF0IjoxNzg0ODM5NjcxLCJleHAiOjE3ODc0MzE2NzF9.p-UNU-zpB7ideaqB-bTCriJMWr5M1Smx1InOG28V9jk"

    const res = http.get(
        "http://localhost:5002/api/product/all-products",{
            headers:{
                Authorization:`Bearer ${token}`
            }
        }
    )

    sleep(1)
}