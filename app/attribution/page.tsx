export default function AttributionPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-surface shadow-sm border-b border-surface-secondary">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <a href="/" className="text-accent-primary hover:text-accent-primary-hover text-sm font-medium">
            ← Back to Home
          </a>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-foreground mb-6">
          Content Attribution & Copyright Policy
        </h1>

        <div className="prose prose-lg max-w-none space-y-8">
          {/* Section 1 */}
          <section className="bg-surface border border-surface-secondary rounded-2xl p-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Our Commitment</h2>
            <p className="text-foreground-secondary leading-relaxed">
              We are committed to respecting intellectual property rights and providing proper attribution 
              to original content creators. This platform serves as a news aggregator that helps readers 
              discover quality journalism from various sources.
            </p>
          </section>

          {/* Section 2 */}
          <section className="bg-surface border border-surface-secondary rounded-2xl p-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">How We Handle Content</h2>
            <div className="space-y-4 text-foreground-secondary leading-relaxed">
              <div>
                <h3 className="font-semibold text-foreground mb-2">1. Limited Excerpts Only</h3>
                <p>
                  We display only brief excerpts and summaries of articles under fair use principles. 
                  We never reproduce entire articles without explicit permission from the copyright holder.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground mb-2">2. Clear Attribution</h3>
                <p>
                  Every article preview includes:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                  <li>Original author's name</li>
                  <li>Publishing organization/source</li>
                  <li>Direct link to the original article</li>
                  <li>Publication date</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">3. Driving Traffic to Sources</h3>
                <p>
                  Our goal is to help readers discover quality content and direct them to the original 
                  source. All article pages include prominent "Read Full Article" buttons that link 
                  directly to the publisher's website.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">4. No Claim of Ownership</h3>
                <p>
                  We make no claim of ownership over aggregated content. All rights remain with the 
                  original publishers and content creators.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="bg-surface border border-surface-secondary rounded-2xl p-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Fair Use Principles</h2>
            <p className="text-foreground-secondary leading-relaxed mb-4">
              Our use of excerpts is guided by fair use principles, which allow limited reproduction 
              of copyrighted material for purposes such as:
            </p>
            <ul className="list-disc list-inside text-foreground-secondary space-y-2 ml-4">
              <li>News reporting and commentary</li>
              <li>Information discovery and aggregation</li>
              <li>Directing users to original sources</li>
              <li>Non-commercial educational purposes</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="bg-accent-warning/10 border border-accent-warning/30 rounded-2xl p-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">For Content Owners</h2>
            <p className="text-foreground-secondary leading-relaxed mb-4">
              If you are a copyright holder and believe your work is being used inappropriately:
            </p>
            <div className="space-y-3 text-foreground-secondary">
              <p>
                <strong className="text-foreground">Removal Requests:</strong> We respect your rights 
                and will promptly remove any content upon request. Please contact us at{' '}
                <span className="text-accent-primary font-medium">copyright@newsapp.com</span>
              </p>
              <p>
                <strong className="text-foreground">Opt-Out:</strong> If you prefer your content not 
                be aggregated on our platform, we will honor your request immediately.
              </p>
              <p>
                <strong className="text-foreground">Collaboration:</strong> We welcome partnerships 
                with publishers and are open to discussing formal content sharing agreements.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section className="bg-surface border border-surface-secondary rounded-2xl p-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">API & Third-Party Content</h2>
            <p className="text-foreground-secondary leading-relaxed">
              When we integrate with news APIs and RSS feeds, we comply with all terms of service 
              and licensing requirements set by the content providers. We only display content from 
              sources that permit aggregation and always maintain proper attribution.
            </p>
          </section>

          {/* Section 6 */}
          <section className="bg-surface border border-surface-secondary rounded-2xl p-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Updates to This Policy</h2>
            <p className="text-foreground-secondary leading-relaxed">
              We may update this policy as our practices evolve or in response to legal requirements. 
              Last updated: January 18, 2026
            </p>
          </section>

          {/* Contact */}
          <section className="text-center py-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Questions or Concerns?</h2>
            <p className="text-foreground-secondary leading-relaxed mb-6">
              We're committed to operating transparently and ethically. If you have any questions 
              about our content practices, please reach out.
            </p>
            <a
              href="mailto:copyright@newsapp.com"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent-primary text-white font-medium rounded-lg hover:bg-accent-primary-hover transition-colors"
            >
              Contact Us
            </a>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-surface border-t border-surface-secondary mt-16">
        <div className="max-w-4xl mx-auto px-6 py-8 text-center">
          <p className="text-sm text-foreground-muted">
            © 2026 NewsApp. All aggregated content remains the property of their respective owners.
          </p>
        </div>
      </footer>
    </div>
  );
}
