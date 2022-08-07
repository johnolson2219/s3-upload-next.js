import Link from "next/link";
import Head from "next/head";
export default function Home() {

  return (
    <div className="container">
      <Head>
        <title>AWS S3 Storage App</title>
        <meta name="description" content="AWS S3 Storage App" />
      </Head>
      <div className="card mr-5">
        <Link href="/s3/single-part-upload">
          <h2>Upload File in Single Part on S3</h2>
        </Link>
      </div>
      <div className="card">
        <Link href="/s3/multipart-upload">
          <h2>Upload File in multipart on S3</h2>
        </Link>
      </div>
    </div>
  )
}
