async function getPoolInfo(a = null) {
  // Set the API endpoint and request body
  const apiUrl = 'https://api.koios.rest/api/v0/pool_info';
  const requestBody = {
    _pool_bech32_ids: [a ?? sessionStorage.getItem("poolID")]
  };

  
  // Send the POST request and retrieve the response data
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  });
  const responseJson = await response.json();

  // Create a table to display the data
  let tableContent = '<table>';
  
  // Get the object from the responseJson array
  const poolData = responseJson[0];
//////////////////////////////////////////////////////////////////////////////////1111
  // Get the pool status value
  const poolStatus = poolData.pool_status;
  // Get the pool_id_bech32 value
  const pool_id_bech32 = poolData.pool_id_bech32;
  // Get the active_epoch_no value
  const active_epoch_no = poolData.active_epoch_no;
  // Get the margin value
  const margin = poolData.margin;
  // Get the meta_hash value
  const metahash = poolData.meta_hash;
  
  // Get the pledge value
  const pledge = (poolData.pledge / 1000000).toFixed(0) + " ADA";
  const live_pledge = (poolData.live_pledge / 1000000).toFixed(0) + " ADA";
  // Get the relay value
  const relays = poolData.relays;
  const relay = relays[0];
  const relayUrl = `ws://${relay.ip}:${relay.port}`;
  const socket = new WebSocket(relayUrl);
  socket.onopen = function() {
      socket.send('ping');
      setTimeout(() => {
          if (socket.readyState === WebSocket.OPEN) {
              socket.close();
              relay_status = "<td class='fail'>Offline</td>"
          }
      }, 5000);
  }

  socket.onmessage = function (event) {
      if (event.data === 'pong') {
          relay_status = "<td class='pass'>Online</td>"
      }
  }
  if(relays && relays.length > 0) {
    const relay = relays[0];
    // WebSocket code here
  } else {
    console.log("No relays found or relays variable is not defined")
    relay_status = "<td class='fail'>Not found</td>"
  }
  

//////////////////////////////////////////////////////////////////////////////////////////////////////2222
  //Add new column
  const registrationStatus = poolStatus === "registered" ? "<td class='pass'>Registered</td>" : "<td class='fail'>Not Registered</td>";
  // Add new column for pool_id_bech32
  const pool_id_status = pool_id_bech32 ? "<td class='pass'>Found</td>" : "<td class='fail'>Not Found</td>";
  // Add new column for active_epoch_no
  const active_epoch_status = active_epoch_no ? "<td class='pass'>Active</td>" : "<td class='fail'>Deceased</td>";
  // Add new column for margin
  const margin_status = margin ? "<td class='pass'>Pass</td>" : "<td class='pass'>Pass</td>";
  const marginInPercent = (margin * 100).toFixed(2) + "%";

  // Add new column for meta hash
  const meta_hash = metahash ? "<td class='pass'>Matched</td>" : "<td class='fail'>Missmatched</td>";
  // Add new column for pledge
  const pledge_status = live_pledge > pledge ? "<td class='pass'>Pass</td>" : "<td class='fail'>Fail</td>";
  // Add new column for relay
  const relay_status = relays ? "<td class='pass'>Found</td>" : "<td class='fail'>Not Found</td>";
  

  // Add the CSS class based on the pool status
  if (poolData.pool_status === "registered") {
    document.getElementById("poolStatus").classList.add("found");
  } else {
    document.getElementById("poolStatus").classList.add("not-found");
  }
  
/////////////////////////////////////////////////////////////////////////////////////////////////3333
  // Add row to the table
  tableContent += `<tr>${registrationStatus}<td>Pool Status</dt><td>${poolStatus}</td></tr>`;
  // Add the pool_id_bech32 value to the table
  tableContent += `<tr>${pool_id_status}<td>Pool ID</td><td>${pool_id_bech32}</td></tr>`;
  // Add the active epoch no value to the table
  tableContent += `<tr>${active_epoch_status}<td>Active Since</td><td>${active_epoch_no}</td></tr>`;
  // Add the margin value to the table
  tableContent += `<tr>${margin_status}<td>Margin</td><td>${marginInPercent}</td></tr>`;
  // Add the meta hash value to the table
  tableContent += `<tr>${meta_hash}<td>Registerd Hash<br>Metadata hash</td><td>${metahash}</td></tr>`;
  // Add the pledge balue to the table
  tableContent += `<tr>${pledge_status}<td>Pledge</td><td>Declare Pledge ${pledge}<br>Live Pledge${live_pledge}</td></tr>`;
  // relay
  // Iterate through the relays array
    for (const relay of relays) {
      let relayString = "";
      for (const key in relay) {
        if (relay[key] !== null) {
          relayString += `${key}: ${relay[key]}<br>`;
        }
        if(key === "ip_address" && relay[key]){
          
          }
      }
      //tableContent += `<tr><td>${relayString}</td></tr>`;
      tableContent += `<tr>${relay_status}<td>Relay</td><td>${relayString}</td></tr>`;
    }
    

  
  tableContent += '</table>';

  // Display the table in the result element
  document.getElementById('poolStatus').innerHTML = tableContent;
}

// Call the getPoolInfo function when the page loads
window.onload = getPoolInfo;
