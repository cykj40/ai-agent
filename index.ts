import 'dotenv/config'

const userMessage = process.argv[2]

if (!userMessage) {
    console.error('Please provide a message as an argument.')
    process.exit(1)
}
