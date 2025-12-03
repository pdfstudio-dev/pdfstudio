import { PDFDocument } from '../src'

console.log('📰 Generating Article Preview Newsletter...\n')

const doc = new PDFDocument({
  size: 'Letter',
  margins: 50
})

// Newsletter header
doc.setFillColor(0.15, 0.23, 0.47) // Dark blue
doc.rect(0, 742, 612, 50)
doc.fill()

doc.setFillColor(1, 1, 1)
doc.text('TECH INSIGHTS', 50, 770, 24, 'Helvetica-Bold')
doc.text('Weekly Newsletter • Issue #247 • March 2025', 50, 750, 10)

// Subheading
doc.setFillColor(0.2, 0.2, 0.2)
doc.text('This Week\'s Top Stories', {
  x: 50,
  y: 715,
  fontSize: 18,
  font: 'Helvetica-Bold',
  paragraphGap: 10  // ← PARAGRAPH GAP: Space after heading
})

console.log('✓ Newsletter header created\n')

// Articles data
const articles = [
  {
    title: 'The Future of Quantum Computing: Breaking Through the Noise Barrier',
    author: 'Dr. Sarah Chen',
    date: 'March 15, 2025',
    readTime: '8 min read',
    category: 'Quantum Tech',
    content: 'Quantum computing has long promised to revolutionize computing, but error rates have held it back. Recent breakthroughs at MIT and Google have demonstrated new error-correction techniques that could finally make quantum computers practical for real-world applications. The new approach uses topological qubits that are inherently more stable than traditional implementations. Industry experts predict that within 3-5 years, we could see quantum computers solving optimization problems that would take classical computers millennia to complete. This could transform fields from drug discovery to financial modeling, cryptography to climate simulation. The race is now on between tech giants and startups to build the first commercially viable quantum system.',
    tags: ['Quantum', 'Computing', 'Innovation']
  },
  {
    title: 'AI Ethics: New Framework Proposed by Leading Tech Companies',
    author: 'Michael Rodriguez',
    date: 'March 14, 2025',
    readTime: '5 min read',
    category: 'AI & Ethics',
    content: 'A coalition of major tech companies including Microsoft, Google, and OpenAI have jointly proposed a comprehensive framework for ethical AI development and deployment. The framework addresses key concerns around bias, transparency, privacy, and accountability. It includes mandatory third-party audits, transparency requirements for training data, and standardized testing for bias across demographic groups. Privacy advocates have praised the initiative while noting that regulatory oversight will still be necessary. The framework could become the de facto industry standard and may influence upcoming AI legislation in the US and EU. Critics argue the framework doesn\'t go far enough in addressing AI\'s environmental impact.',
    tags: ['AI', 'Ethics', 'Policy']
  },
  {
    title: 'Green Data Centers: How Tech Giants Are Achieving Carbon Neutrality',
    author: 'Emma Watson',
    date: 'March 13, 2025',
    readTime: '6 min read',
    category: 'Sustainability',
    content: 'Data centers consume approximately 1% of global electricity, but tech companies are making dramatic strides in sustainability. Amazon, Microsoft, and Google have all committed to carbon-neutral data centers by 2030, and they\'re ahead of schedule. Innovations include AI-optimized cooling systems, underwater data centers, waste heat recovery, and renewable energy contracts. Some facilities now run entirely on solar and wind power. The next frontier is water conservation, with companies developing closed-loop cooling systems. These advances prove that sustainability and performance aren\'t mutually exclusive. The data center industry is becoming a leader in corporate climate action.',
    tags: ['Sustainability', 'Data Centers', 'Climate']
  },
  {
    title: 'The Rise of Edge Computing in IoT Ecosystems',
    author: 'James Park',
    date: 'March 12, 2025',
    readTime: '7 min read',
    category: 'IoT',
    content: 'Edge computing is transforming how IoT devices process data by moving computation closer to data sources. Instead of sending all data to centralized cloud servers, edge devices perform analytics locally, reducing latency from seconds to milliseconds. This is critical for applications like autonomous vehicles, industrial automation, and smart cities. The edge computing market is projected to reach $274 billion by 2027. New chip architectures from ARM, Intel, and NVIDIA are making edge AI more powerful and energy-efficient. However, security remains a major challenge as the attack surface expands with millions of edge nodes. Industry standards are urgently needed.',
    tags: ['Edge Computing', 'IoT', 'Infrastructure']
  }
]

let yPos = doc.getCurrentY()
const leftMargin = 50
const rightMargin = 562
const contentWidth = rightMargin - leftMargin

console.log(`📝 Rendering ${articles.length} article previews...\n`)

articles.forEach((article, index) => {
  // Check if we need a new page
  if (yPos < 150) {
    doc.addPage()
    yPos = 750
  }

  // Article card
  const cardStartY = yPos

  // Category badge
  doc.setFillColor(0.96, 0.96, 0.98)
  const categoryWidth = doc.widthOfString(article.category, 9) + 12
  doc.roundedRect(leftMargin, yPos - 10, categoryWidth, 16, 8)
  doc.fill()

  doc.setFillColor(0.31, 0.27, 0.90)
  doc.text(article.category, leftMargin + 6, yPos - 6, 9, 'Helvetica-Bold')

  yPos -= 25

  // Title (bold, larger font)
  doc.setFillColor(0.1, 0.1, 0.1)
  doc.text(article.title, {
    x: leftMargin,
    y: yPos,
    fontSize: 16,
    font: 'Helvetica-Bold',
    paragraphGap: 8  // ← PARAGRAPH GAP: Space after title
  })

  yPos = doc.getCurrentY()

  // Author and metadata
  doc.setFillColor(0.4, 0.4, 0.4)
  doc.text(`By ${article.author}`, leftMargin, yPos, 10)

  const metaText = `${article.date} • ${article.readTime}`
  const metaX = rightMargin - doc.widthOfString(metaText, 10)
  doc.text(metaText, {
    x: metaX,
    y: yPos,
    fontSize: 10,
    font: 'Helvetica',
    paragraphGap: 10  // ← PARAGRAPH GAP: Space before content
  })

  yPos = doc.getCurrentY()

  // Content preview box with border
  const previewHeight = 65
  const previewStartY = yPos

  // Subtle background
  doc.setFillColor(0.99, 0.99, 1)
  doc.roundedRect(leftMargin, yPos - previewHeight, contentWidth, previewHeight, 6)
  doc.fill()

  // Left border accent
  doc.setFillColor(0.31, 0.27, 0.90)
  doc.roundedRect(leftMargin, yPos - previewHeight, 4, previewHeight, 2)
  doc.fill()

  // Article preview with ELLIPSIS - this is the key feature!
  doc.setFillColor(0.2, 0.2, 0.2)
  doc.text(article.content, {
    x: leftMargin + 12,
    y: yPos - 10,
    width: contentWidth - 20,
    height: previewHeight - 18,  // Limited height for preview
    fontSize: 10,
    align: 'justify',
    lineGap: 3,
    ellipsis: ' ...[Read More]'  // ← CUSTOM ELLIPSIS: Shows there's more content
  })

  yPos -= previewHeight
  yPos -= 10

  // Tags
  let tagX = leftMargin
  article.tags.forEach(tag => {
    doc.setFillColor(0.93, 0.95, 1)
    const tagWidth = doc.widthOfString(`#${tag}`, 8) + 10
    doc.roundedRect(tagX, yPos - 12, tagWidth, 14, 7)
    doc.fill()

    doc.setFillColor(0.31, 0.27, 0.90)
    doc.text(`#${tag}`, tagX + 5, yPos - 8, 8)

    tagX += tagWidth + 6
  })

  yPos -= 22

  // Separator line
  doc.setStrokeColor(0.9, 0.9, 0.92)
  doc.setLineWidth(1)
  doc.moveTo(leftMargin, yPos)
  doc.lineTo(rightMargin, yPos)
  doc.stroke()

  yPos -= 15  // Space before next article

  console.log(`  ${index + 1}. ${article.title}`)
  console.log(`     Author: ${article.author} | ${article.readTime}`)
})

// Footer
doc.addPage()
yPos = 750

doc.setFillColor(0.1, 0.1, 0.1)
doc.text('Subscribe for More', {
  x: 50,
  y: yPos,
  fontSize: 20,
  font: 'Helvetica-Bold',
  paragraphGap: 12
})

const subscribeText = `Thank you for reading Tech Insights! Our weekly newsletter brings you the latest in technology, innovation, and digital transformation.

Want to receive the full articles directly in your inbox? Subscribe now and never miss an issue.`

doc.setFillColor(0.3, 0.3, 0.3)
doc.text(subscribeText, {
  x: 50,
  y: doc.getCurrentY(),
  width: 512,
  fontSize: 11,
  align: 'left',
  lineGap: 4,
  paragraphGap: 20  // ← PARAGRAPH GAP: Space after subscription text
})

// Call to action box
const ctaY = doc.getCurrentY() - 10
doc.setFillColor(0.31, 0.27, 0.90)
doc.roundedRect(50, ctaY - 40, 512, 40, 8)
doc.fill()

doc.setFillColor(1, 1, 1)
doc.text('SUBSCRIBE NOW', 230, ctaY - 18, 14, 'Helvetica-Bold')
doc.text('Visit www.techinsights.example.com/subscribe', 165, ctaY - 32, 10)

// Newsletter footer
doc.setFillColor(0.5, 0.5, 0.5)
doc.text('Tech Insights Weekly Newsletter • Published every Monday • © 2025 Tech Insights Media', {
  x: 50,
  y: 30,
  fontSize: 8,
  font: 'Helvetica',
  align: 'center',
  width: 512
})

// Save
doc.save('examples/output/example-article-preview.pdf')

console.log('\n✅ Article preview newsletter generated successfully!')
console.log('📄 PDF saved to: examples/output/example-article-preview.pdf')
console.log('\n💡 Key Features Demonstrated:')
console.log('   - Ellipsis: Article previews truncated with custom "...[Read More]"')
console.log('   - paragraphGap: Consistent spacing between titles, metadata, and content')
console.log('   - Combined: Professional newsletter layout with perfect typography\n')
