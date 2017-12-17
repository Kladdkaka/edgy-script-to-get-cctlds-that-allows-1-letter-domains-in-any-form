const dns = require('dns')
const fs = require('fs')

const CtrlC = '\u0003'

const shuffle = arr => arr.sort(() => Math.random() - 0.5)

const combis = fs.readFileSync('./1_combis', 'utf-8').split(' ')
const tlds = fs.readFileSync('./tlds', 'utf-8').split(' ')

let domains = []

for (const tld of tlds) {
  for (const combi of combis) {
    domains.push(`${combi}.${tld}`)
  }
}

domains = shuffle(domains)

console.log(domains)
console.log(domains.length)

let goodTlds = new Set()

let lastSize = goodTlds.size

const { stdin } = process

stdin.setRawMode(true)

stdin.resume()

stdin.setEncoding('utf8')

stdin.on('data', key => {
  if (key === CtrlC) {
    console.log('Exiting.')
    return process.exit(0)
  }

  console.log(key)

  switch (key) {
    case CtrlC:
      console.log('Exiting.')
      return process.exit(0)
    case 'l':
      console.log([...goodTlds].join(' '))
      break
    default:
      console.log('unknown key:', key)
  }
})

for (const domain of domains) {
  dns.lookup(domain, (error, address, family) => {
    console.count('response')

    if (error) {
      if (error.code !== 'ENOTFOUND') console.error(domain, error)
      return
    }

    console.log(domain, address)

    goodTlds.add(domain.split('.')[1])

    if (goodTlds.size !== lastSize) console.log('updating', [...goodTlds].join(' '))

    lastSize = goodTlds.size
  })
}
