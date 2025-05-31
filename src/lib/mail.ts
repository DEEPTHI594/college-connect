import nodemailer from 'nodemailer'

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
})

export async function sendPostNotificationEmails({
  to,
  title,
  author,
  subthreadName,
}: {
  to: string[]
  title: string
  author: string
  subthreadName: string
}) {
  await transporter.sendMail({
    from: `"CollegeConnect" <${process.env.GMAIL_USER}>`,
    to,
    subject: `New Post in ${subthreadName}`,
    html: `<p><b>${author}</b> posted: <b>${title}</b> in <i>${subthreadName}</i></p>`,
  })
}
