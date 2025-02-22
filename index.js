import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseURL = "https://uzqstybjgzuxedhmrmfb.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6cXN0eWJqZ3p1eGVkaG1ybWZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAxODA3MTYsImV4cCI6MjA1NTc1NjcxNn0.s0kmAcFU4WHJV6lNOEs2huT0Q9HMFh6ene7VXd_Rh2o"

const supabaseClient = createClient(supabaseURL, supabaseKey)
// console.log("supabase instance", supabaseClient)
async function ping(){
    console.log("pinging")
    const {data, error} = await supabaseClient.from('tests').select('*')
    
    if (error){
        console.error(error)
    } else {
        console.log("fetched data", data)
    }
}
ping()

const userSelect = document.getElementById("user-select")
const customerSelect = document.getElementById("customer-select")
let currentUser = ""



    userSelect.addEventListener("change", (e) => {
        currentUser = e.target.value
        console.log(currentUser)
    })

    async function fetchCustomers(){
        const {data, error} = await supabaseClient.from("customers").select('*')

        if (error){
            console.error(error)
        } else {
            console.log("customers", data)

            data.forEach((customer) => {
                const option = document.createElement("option")
                option.textContent = customer.name
                customerSelect.appendChild(option)
            })
        }
    }

    fetchCustomers()

    customerSelect.addEventListener("change", (e) => {
        console.log(e.target.value)
    })