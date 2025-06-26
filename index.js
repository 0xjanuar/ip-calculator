function main(ip, slash) {
    const [isValidate, error] = validateInput(ip, slash)
    if (!isValidate) {
        alert(`Error: ${error}`)
        return
    }

    const slashPrefix = checkslashPrefix(Number(slash))
    const subnetValue = calculateSubnetValue(Number(slash), slashPrefix)
    const subnetMask = setSubnetValue(subnetValue, slashPrefix).join(".")
    const availableHost = calculateHostsNet(slash)
    let result;
    if (slashPrefix == 'A') {
        result = calcuateIPClassA(ip, subnetValue)
    }

    if (slashPrefix == 'B') {
        result = calcuateIPClassB(ip, subnetValue)
    }

    if (slashPrefix == 'C') {
        result = calcuateIPClassC(ip, subnetValue)
    }

    if (!slashPrefix) {
        result = 'Invalid number'
    }

    result.subnetMask = subnetMask
    result.availableHost = availableHost
    return result
}

function validateInput(ip, slash) {
    // validate ip
    let error;
    if (ip.length == 0) {
        error = "Invalid Number"
        return [false, error]
    }
    if (ip.split(".").length != 4) {
        error = "IP Must Be 4 Length"
        return [false, error]
    }
    const isValid = ip.split(".").every(v => {
        if (isNaN(v) || Number(v) > 255) return false
        return true
    })
    if (!isValid) {
        error = "Invalid Number"
        return [false, error]
    }

    // validate slash 
    if (slash.length == 0 || isNaN(slash)) {
        error = "Invalid Number"
        return [false, error]
    }
    if (slash < 8 || slash > 32) {
        error = "Invalid Number"
        return [false, error]
    }
    return [true, error]
}

function calculateHostsNet(slash) {
    if (Number(slash) == 31 ) return 0
    if (Number(slash) == 32 ) return 1 
    return (2 ** (32 - Number(slash))) - 2 
}

function checkslashPrefix(slash) {
    if ( slash >= 8 && slash <= 15 ) return 'A';
    if ( slash >= 16 && slash <= 23 ) return 'B';
    if ( slash >= 24 && slash <= 32 ) return 'C';
    return false
}

function calculateSubnetValue(slash, slashPrefix) {
    let exponentValue;

    if ( slashPrefix == "A" ) {
        exponentValue = slash - 8
    }
    if (slashPrefix == "B") {
        exponentValue = slash - 16
    } 
    if (slashPrefix == "C") {
        exponentValue = slash - 24
    }
    if (exponentValue == 0) {
        return 0
    }
    exponentValue = 8 - exponentValue
    return 256 - (2 ** exponentValue)

}

function setSubnetValue(subnetValue, slashPrefix) {
    let maskSubnet = [ 255, 255, 255, 0 ]
    if (slashPrefix == 'A') {
        maskSubnet[1] = subnetValue;
        maskSubnet[2] = 0
        return maskSubnet
    } 
    if (slashPrefix == 'B') {
        maskSubnet[2] = subnetValue;
        return maskSubnet
    } 
    if (slashPrefix == 'C') {
        maskSubnet[3] = subnetValue;
        return maskSubnet
    }
    return false 
}

function calcuateIPClassA(ip, subnetValue) {
    const addr = ip.split('.').map(a => Number(a))
    let netmask = 0
    const difference = 256 - subnetValue
    while (addr[1] > netmask && addr[1] > difference && addr[1] > netmask + difference) {
        netmask= netmask + difference
    }
    const network = [...addr]
    network[1] = netmask
    network[2] = 0
    network[3] = 0
    console.log(network)

    const broadcast = [...addr]
    broadcast[1] = netmask + difference - 1
    broadcast[2] = 255
    broadcast[3] = 255

    const hostMin = [...addr]
    hostMin[1] = netmask
    hostMin[2] = 0
    hostMin[3] = 1

    const hostMax = [...addr]
    hostMax[1] = netmask + difference - 1
    hostMax[2] = 255
    hostMax[3] = 255 - 1 

    console.log(network)

    return addressData = {
        network: network.join('.'),
        broadcast: broadcast.join('.'),
        hostMin: hostMin.join('.'),
        hostMax: hostMax.join('.'),
    }
}

function calcuateIPClassB(ip, subnetValue) {
    const addr = ip.split('.').map(a => Number(a))
    let netmask = 0
    const difference = 256 - subnetValue
    while (addr[2] > netmask && addr[2] > difference && addr[2] > netmask + difference) {
        netmask= netmask + difference
    }
    const network = [...addr]
    network[2] = netmask
    network[3] = 0

    const broadcast = [...addr]
    broadcast[2] = netmask + difference - 1
    broadcast[3] = 255

    const hostMin = [...addr]
    hostMin[2] = netmask
    hostMin[3] = 1

    const hostMax = [...addr]
    hostMax[2] = netmask + difference - 1
    hostMax[3] = 255 - 1 

    return addressData = {
        network: network.join('.'),
        broadcast: broadcast.join('.'),
        hostMin: hostMin.join('.'),
        hostMax: hostMax.join('.'),
    }  
}

function calcuateIPClassC(ip, subnetValue) {
    const addr = ip.split('.').map(a => Number(a))
    let netmask = 0
    const difference = 256 - subnetValue

    if (subnetValue == 254 || subnetValue == 255) {
        netmask = addr[3]
    } else {
        while (addr[3] > netmask && addr[3] > difference && addr[3] > netmask + difference) {
            netmask= netmask + difference
        }
    }

    const network = [...addr]
    network[3] = netmask

    const broadcast = [...addr]
    broadcast[3] = netmask + difference - 1

    const hostMin = [...addr]
    hostMin[3] = netmask + 1

    const hostMax = [...addr]
    if (subnetValue == 254 || subnetValue == 255) {
        hostMax[3] = netmask
    } else {
        hostMax[3] = netmask + difference - 2
    }

    return addressData = {
        network: network.join('.'),
        broadcast: broadcast.join('.'),
        hostMin: hostMin.join('.'),
        hostMax: hostMax.join('.'),
    }  
}

const form = document.getElementById("ip-calc")

form.addEventListener('submit', (e) => {
    e.preventDefault()
    const ipAddr = document.getElementById("ipAddr").value;
    const ipPrefix = document.getElementById("ipPrefix").value;

    if ((ipAddr.trim() || ipPrefix.trim()) == '') {
        alert("Error la")
        window.location.reload()
        return
    } 

    const result = main(ipAddr, ipPrefix);
    document.getElementById("network").innerText = `Network: ${result.network}/${ipPrefix}`
    document.getElementById("broadcast").innerText = `Broadcast: ${result.broadcast}`
    document.getElementById("hostMin").innerText = `HostMin: ${result.hostMin}`
    document.getElementById("hostMax").innerText = `HostMax: ${result.hostMax}`
    document.getElementById("subnetMask").innerText = `SubnetMask: ${result.subnetMask}`
    document.getElementById("hosts").innerText = `Hosts Available: ${result.availableHost}`
})

function setError(error) {
    return `<div class="shadow-sm p-3 mb-3">
                <p class="m-0 text-danger" id="errorMessage">Error: ${error}</p>
            </div>`
}