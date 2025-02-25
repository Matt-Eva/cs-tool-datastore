import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseURL = "https://uzqstybjgzuxedhmrmfb.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6cXN0eWJqZ3p1eGVkaG1ybWZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAxODA3MTYsImV4cCI6MjA1NTc1NjcxNn0.s0kmAcFU4WHJV6lNOEs2huT0Q9HMFh6ene7VXd_Rh2o";

const supabaseClient = createClient(supabaseURL, supabaseKey);

const container = document.getElementById("container");
const userSelect = document.getElementById("user-select");
const customerSelect = document.getElementById("customer-select");
const systemCustomerSelect = document.getElementById("system_customer_select");
const systemSelect = document.getElementById("system_select");
const systemsTable = document.getElementById("systems-table");

let currentUser = "";
const customers = [];
const systems = [];
const tools = [];

userSelect.addEventListener("change", (e) => {
  currentUser = e.target.value;
  console.log(currentUser);
});

async function fetchCustomers() {
  const { data, error } = await supabaseClient.from("customers").select("*");

  if (error) {
    console.error(error);
  } else {
    console.log("customers", data);

    data.forEach((customer) => {
      const option = document.createElement("option");
      option.textContent = customer.name;
      customerSelect.append(option);
      systemCustomerSelect.append(option.cloneNode(true));
      customers.push(customer);
    });
  }
}

fetchCustomers();

customerSelect.addEventListener("change", async (e) => {
    if (e.target.value === "") return;
  
    const customerName = e.target.value;
    const customer = customers.find((customer) => customer.name === customerName);
  
    const { data, error } = await supabaseClient
      .from("systems")
      .select("*")
      .eq("customer", customer.id);
    if (error) {
      console.error(error);
    } else {
      console.log("systems", data);
  
      const children = systemsTable.children;
  
      for (const child of children) {
        if (child.className === "sys-row") {
          systemsTable.removeChild(child);
        }
      }
  
      data.forEach((system) => {
        const row = document.createElement("tr");
        row.className = "sys-row";
        const description = document.createElement("td");
        const assetNumber = document.createElement("td");
        const serialNumber = document.createElement("td");
        const selectSystem = document.createElement("td");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.addEventListener("change", (e) => handleCheck(e, system.id));
  
        description.textContent = system.system_description;
        assetNumber.textContent = system.customer_asset_number;
        serialNumber.textContent = system.serial_number;
  
        selectSystem.append(checkbox);
        row.append(description, assetNumber, serialNumber, selectSystem);
        systemsTable.append(row);
      });
    }
  });

async function fetchSystems() {
  const { data, error } = await supabaseClient.from("systems").select("*");

  if (error) {
    console.error(error);
  } else {
    console.log("systems", data);
    data.forEach((system) => {
      const option = document.createElement("option");
      option.textContent = `${system.customer_asset_number}: ${system.system_description}`;
      option.value = system.id;
      systemSelect.append(option);
      systems.push(system);
    });
  }
}

fetchSystems();

systemSelect.addEventListener("change", (e) => {
  console.log(e.target.value);
  if (e.target.value === "") return;

  const id = parseInt(e.target.value);
});

async function fetchTools() {
    const {data, error} = await supabaseClient.from("tools").select("*")

    if (error){
        console.error(error)
        return
    }

    console.log("tools", data)
}

fetchTools()

function handleCheck(e, systemId) {
  if (e.target.checked) {
    fetchSystemTools(systemId);
  } else {
    clearSystemTools(systemId);
  }
}

async function fetchSystemTools(systemId) {
  const { data, error } = await supabaseClient
    .from("system_tools")
    .select("quantity, tools(*)")
    .eq("system", systemId);

  if (error) {
    console.error(error);
  } else {
    console.log(data);
    const toolTable = document.createElement("table");
    toolTable.id = systemId;
    container.append(toolTable);
    const tableBody = document.createElement("tbody");
    toolTable.append(tableBody);

    const name = document.createElement("th");
    name.textContent = "Name";
    const partNumber = document.createElement("th");
    partNumber.textContent = "Part Number";
    const quantity = document.createElement("th");
    quantity.textContent = "System Quantity";
    const csLocation = document.createElement("th");
    csLocation.textContent = "CS Location";
    const stockLocation = document.createElement("th");
    stockLocation.textContent = "Stock Location";
    tableBody.append(name, partNumber, quantity, csLocation, stockLocation);

    data.forEach((tool) => {
      const quantity = tool.quantity;
      const toolData = tool.tools;

      const row = document.createElement("tr");
      tableBody.append(row);

      const name = document.createElement("td");
      name.textContent = toolData.name;
      const partNumber = document.createElement("td");
      partNumber.textContent = toolData.part_number;
      const tableQuantity = document.createElement("td");
      tableQuantity.textContent = quantity;
      const csLocation = document.createElement("td");
      csLocation.textContent = toolData.cs_location;
      const stockLocation = document.createElement("td");
      stockLocation.textContent = toolData.stock_location;

      row.append(name, partNumber, tableQuantity, csLocation, stockLocation);
    });
  }
}

function clearSystemTools(systemId) {
  const table = document.getElementById(`${systemId}`);
  table.remove();
}
