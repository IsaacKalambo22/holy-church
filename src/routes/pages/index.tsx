import { Elysia } from 'elysia'
import { renderToString } from 'react-dom/server'
import { Layout } from '../../components/Layout'
import { HomePage } from '../../components/HomePage'
import { SermonsPage } from '../../components/SermonsPage'
import { EventsPage } from '../../components/EventsPage'
import { GalleryPage } from '../../components/GalleryPage'
import { GivePage } from '../../components/GivePage'
import { BlogPage } from '../../components/BlogPage'
import { PrayerRequestsPage } from '../../components/PrayerRequestsPage'
import { PodcastsPage } from '../../components/PodcastsPage'
import { AboutUsPage } from '../../components/AboutUsPage'
import { ServicesPage } from '../../components/ServicesPage'

export const pageRoutes = new Elysia({ prefix: '' })
  .get('/', () => {
    const html = renderToString(
      <Layout>
        <HomePage />
      </Layout>
    )
    return new Response(html, {
      headers: { 'Content-Type': 'text/html' },
    })
  })
  .get('/sermons', () => {
    const html = renderToString(
      <Layout>
        <SermonsPage />
      </Layout>
    )
    return new Response(html, {
      headers: { 'Content-Type': 'text/html' },
    })
  })
  .get('/events', () => {
    const html = renderToString(
      <Layout>
        <EventsPage />
      </Layout>
    )
    return new Response(html, {
      headers: { 'Content-Type': 'text/html' },
    })
  })
  .get('/gallery', () => {
    const html = renderToString(
      <Layout>
        <GalleryPage />
      </Layout>
    )
    return new Response(html, {
      headers: { 'Content-Type': 'text/html' },
    })
  })
  .get('/give', () => {
    const html = renderToString(
      <Layout>
        <GivePage />
      </Layout>
    )
    return new Response(html, {
      headers: { 'Content-Type': 'text/html' },
    })
  })
  .get('/blog', () => {
    const html = renderToString(
      <Layout>
        <BlogPage />
      </Layout>
    )
    return new Response(html, {
      headers: { 'Content-Type': 'text/html' },
    })
  })
  .get('/prayer-requests', () => {
    const html = renderToString(
      <Layout>
        <PrayerRequestsPage />
      </Layout>
    )
    return new Response(html, {
      headers: { 'Content-Type': 'text/html' },
    })
  })
  .get('/podcasts', () => {
    const html = renderToString(
      <Layout>
        <PodcastsPage />
      </Layout>
    )
    return new Response(html, {
      headers: { 'Content-Type': 'text/html' },
    })
  })
  .get('/about-us', () => {
    const html = renderToString(
      <Layout>
        <AboutUsPage />
      </Layout>
    )
    return new Response(html, {
      headers: { 'Content-Type': 'text/html' },
    })
  })
  .get('/services', () => {
    const html = renderToString(
      <Layout>
        <ServicesPage />
      </Layout>
    )
    return new Response(html, {
      headers: { 'Content-Type': 'text/html' },
    })
  })
