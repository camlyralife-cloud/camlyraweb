#!/usr/bin/perl
# Calmyra — Compliance cleanup script
# Fixes clinical language on Dubai coaching/career pages

use strict;
use warnings;
use File::Find;
use File::Spec;
use File::Basename;
use Cwd 'abs_path';

my $ROOT = abs_path(dirname($0) . '/..');

# -----------------------------------------------------------------------
# Files that are Dubai-facing (coaching/career pages = non-clinical)
# -----------------------------------------------------------------------
my @DUBAI_PAGES = map { "$ROOT/$_" } (
    'services/coaching/life-coaching.html',
    'services/coaching/mindset-coaching.html',
    'services/coaching/executive-wellness.html',
    'services/career/Burnout.html',
    'services/career/Careercounselling.html',
    'services/career/Effectivecommunication.html',
    'services/career/Executivecoaching.html',
    'services/career/Leadership-Psychology.html',
    'services/career/Productivity.html',
);

# -----------------------------------------------------------------------
# Files where "licensed psychologists in Dubai" must be updated
# (India clinical pages that incorrectly cite Dubai)
# -----------------------------------------------------------------------
my @INDIA_CLINICAL_PAGES = map { "$ROOT/$_" } (
    'services/specific-disorders/Anxiety.html',
    'services/specific-disorders/Mooddisorder.html',
    'services/specific-disorders/PTSD.html',
    'services/specific-disorders/OCD.html',
    'services/specific-disorders/Postpartumdepression.html',
    'services/specific-disorders/Sleepingdisorder.html',
    'services/specific-disorders/Eatingdisorder.html',
    'services/specific-disorders/Substanceabuse.html',
    'services/specific-disorders/Personalitydisorder.html',
    'services/specific-disorders/Phobias.html',
    'services/specific-disorders/Psychosis.html',
    'services/relationship/couple-counselling.html',
    'services/relationship/marriage-counselling.html',
    'services/relationship/pre-marital-counselling.html',
    'services/relationship/divorce-counselling.html',
    'services/relationship/parent-counselling.html',
    'services/relationship/relationship-counselling.html',
    'services/Teen-and-childern/adolescent-anxiety.html',
    'services/Teen-and-childern/behavioural-emotional-support.html',
    'services/Teen-and-childern/family-sessions.html',
    'services/Teen-and-childern/identity-social-skills.html',
    'services/Teen-and-childern/school-stress.html',
    'services/life-crises/Abuse.html',
    'services/life-crises/Crisisintervention.html',
    'services/life-crises/Grief.html',
    'services/life-crises/Trauma.html',
    'services/geriatrics/Alzheimers.html',
    'assessment.html',
);

my $total = 0;

sub fix_file {
    my ($file, @transforms) = @_;

    return unless -f $file;

    open(my $fh, '<', $file) or do { warn "Cannot read $file: $!"; return; };
    my $html = do { local $/; <$fh> };
    close($fh);

    my $original = $html;

    for my $t (@transforms) {
        my ($from, $to) = @$t;
        $html =~ s/\Q$from\E/$to/g;
    }

    if ($html ne $original) {
        open(my $out, '>', $file) or do { warn "Cannot write $file: $!"; return; };
        print $out $html;
        close($out);
        $total++;
        my $rel = File::Spec->abs2rel($file, $ROOT);
        $rel =~ s/\\/\//g;
        print "  [FIXED]  $rel\n";
    }
}

# -----------------------------------------------------------------------
# 1. Fix Dubai coaching/career pages
#    - Remove "clinical diagnosis" disclaimers
#    - Remove "licensed psychologist" references
#    - Remove "treatment" language
# -----------------------------------------------------------------------
print "\n--- Fixing Dubai coaching/career pages ---\n";

my @DUBAI_TRANSFORMS = (
    # Remove clinical diagnosis disclaimer line
    ['<p class="journey-disclaimer"><span>Disclaimer:</span> Sessions vary based on your clinical diagnosis.</p>', ''],
    # Fix "licensed psychologist" on Dubai pages
    ['a licensed psychologist', 'a qualified professional'],
    ['Our licensed psychologists provide professional counselling', 'Our qualified professionals provide dedicated sessions'],
    ['licensed psychologists in Dubai', 'qualified professionals in Dubai'],
    # Fix clinical therapy reference in executive wellness
    ['Confidential therapy with a licensed psychologist for burnout, anxiety, depression, relationship issues, or acute performance stress.',
     'Confidential one-to-one sessions with a qualified professional for workplace stress, burnout, and performance challenges.'],
    # Fix "clinical diagnosis" in Burnout FAQ
    ['Sessions vary based on your clinical diagnosis.', 'Session plans are tailored to your individual needs and goals.'],
    # Fix "treatment" language
    ['the effectiveness of the treatment', 'the effectiveness of the programme'],
    ['proper intervention', 'appropriate support'],
    ['recovery from burnout', 'recovery and renewal'],
    # Remove DHA Licensed from any remaining badges
    ["\x{2726} DHA Licensed &nbsp;", ''],
    ['DHA Licensed', ''],
);

for my $file (@DUBAI_PAGES) {
    fix_file($file, @DUBAI_TRANSFORMS);
}

# -----------------------------------------------------------------------
# 2. Fix India clinical pages — remove "in Dubai" from meta/hero text
#    Keep "qualified psychologists" (not "licensed" which implies DHA)
# -----------------------------------------------------------------------
print "\n--- Fixing India clinical page meta/hero text ---\n";

my @INDIA_TRANSFORMS = (
    # Update meta descriptions that say "in Dubai, Bangalore, and online"
    ['licensed psychologists in Dubai, Bangalore, and online', 'qualified psychologists in Bangalore and online'],
    ['licensed psychologists in Dubai and Bangalore', 'qualified psychologists in Bangalore'],
    # Update hero text
    ['Evidence-based anxiety treatment with licensed psychologists — in Dubai, Bangalore, and online worldwide.',
     'Evidence-based anxiety support with qualified psychologists — in Bangalore and online worldwide.'],
    ['Evidence-based depression and mood treatment with licensed psychologists — in Dubai, Bangalore, and online worldwide.',
     'Evidence-based depression and mood support with qualified psychologists — in Bangalore and online worldwide.'],
    ['Evidence-based trauma and PTSD treatment with licensed psychologists — in Dubai, Bangalore, and online worldwide.',
     'Evidence-based trauma and PTSD support with qualified psychologists — in Bangalore and online worldwide.'],
    ['Evidence-based OCD treatment with licensed psychologists — in Dubai, Bangalore, and online worldwide.',
     'Evidence-based OCD support with qualified psychologists — in Bangalore and online worldwide.'],
    ['Evidence-based eating disorder treatment with licensed psychologists — in Dubai, Bangalore, and online worldwide.',
     'Evidence-based eating disorder support with qualified psychologists — in Bangalore and online worldwide.'],
    ['Evidence-based sleep treatment with licensed psychologists — in Dubai, Bangalore, and online worldwide.',
     'Evidence-based sleep support with qualified psychologists — in Bangalore and online worldwide.'],
    ['Evidence-based substance abuse treatment with licensed psychologists — in Dubai, Bangalore, and online worldwide.',
     'Evidence-based substance abuse support with qualified psychologists — in Bangalore and online worldwide.'],
    ['Evidence-based personality disorder treatment with licensed psychologists — in Dubai, Bangalore, and online worldwide.',
     'Evidence-based personality support with qualified psychologists — in Bangalore and online worldwide.'],
    ['Evidence-based phobia treatment with licensed psychologists — in Dubai, Bangalore, and online worldwide.',
     'Evidence-based phobia support with qualified psychologists — in Bangalore and online worldwide.'],
    ['Evidence-based postpartum depression treatment with licensed psychologists — in Dubai, Bangalore, and online worldwide.',
     'Evidence-based postpartum support with qualified psychologists — in Bangalore and online worldwide.'],
    ['Specialist psychosis support with licensed psychologists — in Dubai, Bangalore, and online worldwide.',
     'Specialist psychosis support with qualified psychologists — in Bangalore and online worldwide.'],
    # Fix journey section "licensed psychologists" across India pages
    ['Our licensed psychologists provide professional counselling that is efficient, discreet, and customised to your needs.',
     'Our qualified psychologists provide professional counselling that is thorough, discreet, and customised to your needs.'],
    # Fix "patient" language
    ['Patient-friendly pathways', 'Accessible pathways'],
    ['their anxiety patients using', 'their clients using'],
    ['anxiety patients using', 'clients using'],
    ['calmyra Psychologist helps their anxiety patients', 'Our psychologists support clients'],
    # Remove "clinical diagnosis" disclaimers from India pages too (replace with better wording)
    ['<p class="journey-disclaimer"><span>Disclaimer:</span> Sessions vary based on your clinical diagnosis.</p>',
     '<p class="journey-disclaimer"><span>Note:</span> Session plans are tailored individually. All services are delivered by qualified professionals.</p>'],
    # Fix meta descriptions for specific disorders
    ["Calmyra's licensed psychologists offer evidence-based anxiety treatment in Dubai, Bangalore, and online",
     "Calmyra's qualified psychologists offer evidence-based anxiety support in Bangalore and online"],
    ["Calmyra's licensed psychologists offer evidence-based eating disorder treatment in Dubai, Bangalore, and online",
     "Calmyra's qualified psychologists offer evidence-based eating disorder support in Bangalore and online"],
    ["Calmyra's licensed psychologists offer evidence-based depression and mood disorder treatment in Dubai, Bangalore, and online",
     "Calmyra's qualified psychologists offer evidence-based mood support in Bangalore and online"],
    ["Calmyra's licensed psychologists offer evidence-based OCD treatment in Dubai, Bangalore, and online",
     "Calmyra's qualified psychologists offer evidence-based OCD support in Bangalore and online"],
    ["Calmyra's licensed psychologists offer evidence-based personality disorder treatment in Dubai, Bangalore, and online",
     "Calmyra's qualified psychologists offer evidence-based personality support in Bangalore and online"],
    ["Calmyra's licensed psychologists offer evidence-based phobia treatment in Dubai, Bangalore, and online",
     "Calmyra's qualified psychologists offer evidence-based phobia support in Bangalore and online"],
    ["Calmyra's licensed psychologists offer evidence-based postpartum depression treatment in Dubai, Bangalore, and online",
     "Calmyra's qualified psychologists offer evidence-based postpartum support in Bangalore and online"],
    ["Calmyra's licensed psychologists offer evidence-based psychosis treatment in Dubai, Bangalore, and online",
     "Calmyra's qualified psychologists offer specialist psychosis support in Bangalore and online"],
    ["Calmyra's licensed psychologists offer evidence-based trauma and PTSD treatment in Dubai, Bangalore, and online",
     "Calmyra's qualified psychologists offer evidence-based trauma and PTSD support in Bangalore and online"],
    ["Calmyra's licensed psychologists offer evidence-based sleep disorder treatment in Dubai, Bangalore, and online",
     "Calmyra's qualified psychologists offer evidence-based sleep support in Bangalore and online"],
    ["Calmyra's licensed psychologists offer evidence-based substance abuse treatment in Dubai, Bangalore, and online",
     "Calmyra's qualified psychologists offer evidence-based substance abuse support in Bangalore and online"],
    # Assessment page fixes
    ["Calmyra's comprehensive assessments are conducted by licensed psychologists in Dubai and Bangalore",
     "Calmyra's comprehensive assessments are conducted by qualified psychologists in Bangalore"],
);

for my $file (@INDIA_CLINICAL_PAGES) {
    fix_file($file, @INDIA_TRANSFORMS);
}

# -----------------------------------------------------------------------
# 3. Fix homepage specific issues
# -----------------------------------------------------------------------
print "\n--- Fixing homepage ---\n";
fix_file("$ROOT/index.html",
    ['Our team of licensed psychologists, therapists, and certified coaches brings together clinical rigour and genuine warmth',
     'Our team of psychologists, counsellors, and coaches brings together professional expertise and genuine warmth'],
);

# -----------------------------------------------------------------------
# 4. Fix terms.html
# -----------------------------------------------------------------------
print "\n--- Fixing terms.html ---\n";
fix_file("$ROOT/terms.html",
    ['UAE: Dubai Health Authority Licence No. [XXXXXX]. India: RCI No. [XXXXXX]. All coaches hold internationally recognised coaching certifications.',
     'India: RCI Registered (No. [XXXXXX]). Dubai: Qualified coaches and consultants holding internationally recognised certifications. Coaching and consulting services are non-clinical and developmental in nature.'],
);

# -----------------------------------------------------------------------
# 5. Fix What Our Patients Say on any remaining pages
# -----------------------------------------------------------------------
print "\n--- Fixing patient language sitewide ---\n";
my @ALL_HTML;
find(sub {
    return if /^\./ || ($File::Find::name =~ /\/(node_modules|\.git|scripts|frontend|backend|memory|test_reports|tests)\//) ;
    push @ALL_HTML, $File::Find::name if -f $_ && /\.html$/;
}, $ROOT);

for my $file (@ALL_HTML) {
    fix_file($file,
        ['What Our Patients Say', 'What Our Clients Say'],
        ['You are never with an unlicensed practitioner', 'You are always working with a properly qualified professional'],
    );
}

print "\n✓ Compliance fixes applied to $total file(s)\n";
