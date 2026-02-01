// Helper functions
function validateIpv4(ip) {
    const parts = ip.split('.');
    return parts.length === 4 && parts.every(p => {
        const n = Number(p);
        return !isNaN(n) && n >= 0 && n <= 255 && p === n.toString();
    });
}

function ipToInt(ip) {
    return ip.split('.').reduce((acc, octet) => (acc << 8) | Number(octet), 0) >>> 0;
}

function intToIp(int) {
    return [(int >>> 24) & 255, (int >>> 16) & 255, (int >>> 8) & 255, int & 255].join('.');
}

// Tab switching
document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', () => {
        // Remove active from all
        document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));

        // Add active to clicked
        button.classList.add('active');
        document.getElementById(button.dataset.tab).classList.add('active');
    });
});

// 1. IPv4 → IPv6 Mapped
function convertIpv4ToIpv6() {
    const ipv4 = document.getElementById('ipv4Input').value.trim();
    const resultEl = document.getElementById('ipv6Result');

    if (!validateIpv4(ipv4)) {
        resultEl.innerText = 'IPv4 không hợp lệ.';
        return;
    }

    const hex = ipv4.split('.')
        .map(oct => Number(oct).toString(16).padStart(2, '0'))
        .join('');

    const ipv6 = '::ffff:' + hex.substring(0,4) + ':' + hex.substring(4);
    resultEl.innerText = ipv6;
}

// 2. IPv6 Mapped → IPv4 (đã sửa để hỗ trợ dạng nén)
function expandIpv6(ipv6) {
    ipv6 = ipv6.toLowerCase().trim();
    if (ipv6 === '::') return '0000:0000:0000:0000:0000:0000:0000:0000';

    let parts = ipv6.split('::');
    if (parts.length > 2) return null;

    let left = parts[0] ? parts[0].split(':').filter(p => p) : [];
    let right = parts[1] ? parts[1].split(':').filter(p => p) : [];

    const missing = 8 - (left.length + right.length);
    if (missing < 0) return null;

    const zeros = Array(missing).fill('0000');
    const expanded = [...left, ...zeros, ...right].map(g => g.padStart(4, '0'));

    return expanded.join(':');
}

function extractIpv4FromMapped(expanded) {
    if (!expanded) return null;
    const parts = expanded.split(':');
    if (parts.length !== 8) return null;

    // IPv4-mapped: ....:0000:ffff:xxxx:yyyy
    if (parts[5] === 'ffff' &&
        parts[0] === '0000' && parts[1] === '0000' &&
        parts[2] === '0000' && parts[3] === '0000' &&
        parts[4] === '0000') {

        const hex = parts[6] + parts[7];
        const octets = [];
        for (let i = 0; i < 8; i += 2) {
            octets.push(parseInt(hex.substr(i, 2), 16));
        }
        return octets.join('.');
    }

    // Hỗ trợ dạng dotted decimal (hiếm)
    if (parts[6].includes('.') || parts[7].includes('.')) {
        return [parts[6], parts[7]].join(':');
    }

    return null;
}

function convertIpv6ToIpv4() {
    const input = document.getElementById('ipv6Input').value.trim();
    const resultEl = document.getElementById('ipv4Result');

    if (!input) {
        resultEl.innerText = 'Vui lòng nhập địa chỉ.';
        return;
    }

    const expanded = expandIpv6(input);
    if (!expanded) {
        resultEl.innerText = 'Định dạng IPv6 không hợp lệ.';
        return;
    }

    const ipv4 = extractIpv4FromMapped(expanded);
    resultEl.innerText = ipv4 || 'Không phải địa chỉ IPv6 mapped IPv4 hợp lệ.';
}

// 3. Subnet Mask Converter
function cidrToNetmask(cidr) {
    cidr = parseInt(cidr);
    if (isNaN(cidr) || cidr < 0 || cidr > 32) return 'CIDR không hợp lệ';
    let mask = 0xffffffff << (32 - cidr);
    return [(mask >>> 24) & 255, (mask >>> 16) & 255, (mask >>> 8) & 255, mask & 255].join('.');
}

function netmaskToCidr(mask) {
    const parts = mask.split('.').map(Number);
    if (parts.length !== 4 || parts.some(isNaN)) return 'Netmask không hợp lệ';
    let cidr = 0;
    for (let p of parts) {
        cidr += (p.toString(2).match(/1/g) || []).length;
    }
    return cidr;
}

function convertSubnetMask() {
    const input = document.getElementById('maskInput').value.trim();
    const resultEl = document.getElementById('maskResult');

    if (input.startsWith('/')) {
        resultEl.innerText = cidrToNetmask(input.slice(1));
    } else {
        resultEl.innerText = '/' + netmaskToCidr(input);
    }
}

// 4. Subnet Calculator
function calculateSubnets() {
    const ip = document.getElementById('ipInput').value.trim();
    const cidrStr = document.getElementById('cidrInput').value.trim();
    let numSubnets = Number(document.getElementById('subnetsInput').value.trim()) || 1;
    const resultEl = document.getElementById('subnetResult');

    if (!validateIpv4(ip) || !cidrStr) {
        resultEl.innerText = 'IP hoặc CIDR không hợp lệ.';
        return;
    }

    const cidr = parseInt(cidrStr);
    if (isNaN(cidr) || cidr < 0 || cidr > 32) {
        resultEl.innerText = 'CIDR phải từ 0 đến 32.';
        return;
    }

    const subnetBits = Math.ceil(Math.log2(numSubnets));
    const newCidr = cidr + subnetBits;
    if (newCidr > 32) {
        resultEl.innerText = 'Không thể chia thành nhiều subnet như vậy.';
        return;
    }

    const ipInt = ipToInt(ip);
    const mask = 0xffffffff << (32 - cidr);
    const network = ipInt & mask;
    const subnetSize = 1 << (32 - newCidr);

    let output = `Mạng gốc: ${intToIp(network)}/${cidr}\n`;
    output += `Số subnet: ${numSubnets}   |   Mỗi subnet có /${newCidr}\n\n`;

    for (let i = 0; i < numSubnets; i++) {
        const base = network + i * subnetSize;
        const broadcast = base + subnetSize - 1;
        output += `Subnet ${i+1}:\n`;
        output += `  Network:   ${intToIp(base)}/${newCidr}\n`;
        output += `  Broadcast: ${intToIp(broadcast)}\n`;
        output += `  Hosts:     ${intToIp(base+1)} - ${intToIp(broadcast-1)}\n`;
        output += `  Số host khả dụng: ${subnetSize - 2}\n\n`;
    }

    resultEl.innerText = output;
}