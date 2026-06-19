$root = Split-Path $PSScriptRoot -Parent
$files = Get-ChildItem -Path $root -Recurse -Include *.html,*.htm -File | Where-Object { $_.FullName -notmatch '\\scripts\\' }

$coachingBlockTemplate = @'
                    <div class="nav-ns-wrap nav-coaching-wrap">
                        <button type="button" class="nav-ns-btn" id="nav-coaching-btn" aria-expanded="false"
                            aria-controls="coaching-dropdown-panel" aria-haspopup="true">
                            Coaching
                            <span class="nav-ns-chevron" aria-hidden="true"></span>
                        </button>
                        <div class="ns-dropdown ns-dropdown--wide" id="coaching-dropdown-panel" role="navigation" aria-label="Coaching menu" hidden>
                            <p class="ns-dropdown-heading">Personal Growth</p>
                            <a class="ns-dropdown-link" href="{COACH}life-coaching.html">Life Coaching</a>
                            <a class="ns-dropdown-link" href="{COACH}mindset-coaching.html">Mindset Coaching</a>
                            <a class="ns-dropdown-link" href="{CAREER}Burnout.html">Confidence &amp; Self-Worth Coaching</a>
                            <p class="ns-dropdown-heading">Professional Excellence</p>
                            <a class="ns-dropdown-link" href="{COACH}executive-wellness.html">Executive Wellness Programme</a>
                            <a class="ns-dropdown-link" href="{CAREER}Executivecoaching.html">Leadership Psychology</a>
                            <a class="ns-dropdown-link" href="{CAREER}Productivity.html">High-Performance Coaching</a>
                            <a class="ns-dropdown-link ns-dropdown-link--cta" href="{INDEX}#coaching">Explore All Coaching</a>
                        </div>
                    </div>
'@

foreach ($file in $files) {
    $rel = $file.FullName.Substring($root.Length + 1)
    $depth = ($rel -split '[\\/]').Count - 1
    $parentRel = Split-Path $rel -Parent

    if ($parentRel -eq 'services\coaching') {
        $coachP = ''
        $careerP = '../career/'
        $indexP = '../../index.html'
    } elseif ($depth -eq 0) {
        $coachP = 'services/coaching/'
        $careerP = 'services/career/'
        $indexP = 'index.html'
    } elseif ($depth -eq 1) {
        $coachP = 'coaching/'
        $careerP = 'career/'
        $indexP = '../index.html'
    } else {
        $coachP = '../../services/coaching/'
        $careerP = '../../services/career/'
        $indexP = '../../index.html'
    }

    $rp = if ($depth -le 0) { '' } else { ('../' * $depth) }

    $content = [IO.File]::ReadAllText($file.FullName)
    $orig = $content

    $content = $content.Replace('Hear and Heal', 'Calmyra')
    $content = $content.Replace('Hear & Heal', 'Calmyra')
    $content = $content.Replace('hear & heal', 'Calmyra')

    $content = $content -replace '<h1>Best Therapists for ', '<h1>'

    $content = $content -replace '(?s)\s*<div class="mega-promo">\s*<img[^>]*homepage\.webp[^>]*>\s*</div>', ''

    $content = $content -replace '\r?\n\s*<a href="[^"]*#blog">Blog</a>\s*', "`n"
    $content = $content -replace '\r?\n\s*<li><a href="[^"]*#blog">Blog</a></li>\s*', "`n"

    $getStarted = "${rp}index.html#get-started"
    $content = $content -replace '(?s)<div class="nav-actions">\s*<a href="[^"]*" class="nav-link">Join community</a>\s*<a href="[^"]*" class="btn btn-secondary btn-sm">Booking Hub</a>\s*</div>', "<div class=`"nav-actions`"><a href=`"$getStarted`" class=`"btn btn-primary btn-sm`">Book a Consultation</a></div>"
    $content = $content -replace '<a href="[^"]*#footer" class="btn btn-secondary btn-sm">Booking Hub</a>', "<a href=`"$getStarted`" class=`"btn btn-primary btn-sm`">Book a Consultation</a>"

    $privacy = "${rp}privacy.html"
    $terms = "${rp}terms.html"
    $content = $content -replace 'href="#footer">Terms and conditions', "href=`"$terms`">Terms and conditions"
    $content = $content -replace 'href="#footer">Privacy policy', "href=`"$privacy`">Privacy policy"
    $content = $content -replace 'href="[^"]*index\.html#footer">Terms and conditions', "href=`"$terms`">Terms and conditions"
    $content = $content -replace 'href="[^"]*index\.html#footer">Privacy policy', "href=`"$privacy`">Privacy policy"

    if ($depth -eq 0) {
        $content = $content.Replace('services/geriatrics/Dementia.html', 'services/neuro-psychology.html')
    } elseif ($depth -eq 1) {
        $content = $content.Replace('geriatrics/Dementia.html', 'neuro-psychology.html')
        $content = $content.Replace('services/geriatrics/Dementia.html', 'neuro-psychology.html')
    } else {
        $content = $content.Replace('../../services/geriatrics/Dementia.html', '../../services/neuro-psychology.html')
        $content = $content.Replace('geriatrics/Dementia.html', 'neuro-psychology.html')
    }

    $content = $content -replace '(?s)\s*<div class="footer-social"[^>]*>.*?</div>(?=\s*</div>\s*</div>\s*</footer>)', ''

    $content = $content.Replace('healing minds, transforming lives', 'Where clarity meets calm')
    $content = $content.Replace('Healing minds, transforming lives.', 'Where clarity meets calm. Premium mental wellness — Dubai · Bangalore · Online Worldwide.')

    if ($content -notmatch 'nav-coaching-wrap') {
        $block = $coachingBlockTemplate.Replace('{COACH}', $coachP).Replace('{CAREER}', $careerP).Replace('{INDEX}', $indexP)
        $content = $content -replace '(</div>\s*</div>\s*)\s*(<a href="[^"]*assessment\.html">Assessment</a>)', "`$1`n$block`n                    `$2"
    }

    if ($content -ne $orig) {
        [IO.File]::WriteAllText($file.FullName, $content)
        Write-Host "Updated: $rel"
    }
}

Write-Host 'Bulk fix complete.'
