import re
from pathlib import Path

path = Path(__file__).resolve().parent.parent / 'index.html'
text = path.read_text(encoding='utf-8')
pattern = re.compile(r'(<section id="india-services" class="service-matrix-section">.*?)(?=<section id="why" class="section-blue")', re.DOTALL)
replacement = '''<section id="india-services" class="service-matrix-section">
        <div class="container">
            <div class="matrix-intro">
                <span class="eyebrow">Calmyra India</span>
                <h2>Psychological care designed for clarity, dignity, and results.</h2>
                <p>Our Bangalore practice brings together registered psychologists, counsellors, and assessment specialists to support adults, young people, couples and families through serious emotional challenges and developmental transitions.</p>
            </div>

            <div class="regional-divider">Bangalore · Psychology-led care · Registered professionals</div>

            <div class="matrix-grid">
                <article class="matrix-card">
                    <strong>Clinical therapy & counselling</strong>
                    <p>Evidence-based treatment for anxiety, depression, trauma, OCD, mood disorders, relationship distress and emotional overwhelm.</p>
                </article>
                <article class="matrix-card">
                    <strong>Psychological assessment</strong>
                    <p>Structured evaluation for cognition, personality, mood, ADHD, neurodiversity, and tailored care planning.</p>
                </article>
                <article class="matrix-card">
                    <strong>Child, adolescent & family support</strong>
                    <p>Care for young people, school stress, behavioural challenges and parenting transitions with developmental expertise.</p>
                </article>
                <article class="matrix-card">
                    <strong>Relationship counselling</strong>
                    <p>Confidential couple, marriage, pre-marital and separation support grounded in psychological insight and practical communication.</p>
                </article>
                <article class="matrix-card">
                    <strong>Neuro-psychology & brain health</strong>
                    <p>Specialist neuro-psychological care for memory, executive functioning, adult ADHD, and brain-based wellbeing.</p>
                </article>
                <article class="matrix-card">
                    <strong>Assessment-led case planning</strong>
                    <p>Validated measurement, clinical formulation and clear pathways to healing, growth and sustainable recovery.</p>
                </article>
            </div>
        </div>
    </section>'''
new_text, count = pattern.subn(replacement + '\n\n    ', text, count=1)
if count != 1:
    raise RuntimeError(f'Expected to replace 1 section block, but replaced {count}')
path.write_text(new_text, encoding='utf-8')
print(f'Replaced {count} blocks')
