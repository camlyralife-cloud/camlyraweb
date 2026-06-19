$root = Split-Path $PSScriptRoot -Parent
$utf8 = New-Object System.Text.UTF8Encoding $false
$tagline = 'Where clarity meets calm. Premium mental wellness &mdash; Dubai &middot; Bangalore &middot; Online Worldwide.'

function Get-FooterHtml([string]$rp, [string]$svcPrefix, [string]$coachPrefix) {
    return @"
    <footer id="footer" class="site-footer">
        <div class="container footer-inner">
            <div class="footer-grid">
                <div class="footer-col footer-brand" id="locations">
                    <a href="${rp}index.html#hero" class="footer-logo-link" aria-label="Calmyra home">
                        <img src="${rp}assets/images/logo.png" alt="Calmyra - Where clarity meets calm" width="2000" height="2000" decoding="async">
                    </a>
                    <p class="footer-tagline">$tagline</p>
                    <div class="footer-contact-block">
                        <span class="footer-address-label">Dubai</span>
                        <p class="footer-address">[Suite/Floor, Building, Area, Dubai, UAE]</p>
                        <p class="footer-contact-links">
                            <a href="tel:+971000000000">+971 [XX XXX XXXX]</a><br>
                            <a href="mailto:dubai@calmyra.com">dubai@calmyra.com</a>
                        </p>
                    </div>
                    <div class="footer-contact-block">
                        <span class="footer-address-label">Bangalore</span>
                        <p class="footer-address">R H Plaza, 1st Floor, No. 3<br>
                            Near Marks &amp; Spencer, 100 Feet Road<br>
                            Ejipura, Koramangala, Bengaluru - 560047</p>
                        <p class="footer-contact-links">
                            <a href="tel:+917092099209">+91 70920 99209</a><br>
                            <a href="mailto:bangalore@calmyra.com">bangalore@calmyra.com</a>
                        </p>
                    </div>
                </div>
                <div class="footer-col">
                    <h4 class="footer-col-title">Services</h4>
                    <ul class="footer-col-list">
                        <li><a href="${svcPrefix}specific-disorders/Anxiety.html">Clinical Therapy</a></li>
                        <li><a href="${coachPrefix}life-coaching.html">Life Coaching</a></li>
                        <li><a href="${coachPrefix}mindset-coaching.html">Mindset Coaching</a></li>
                        <li><a href="${coachPrefix}executive-wellness.html">Executive Wellness</a></li>
                        <li><a href="${svcPrefix}relationship/couple-counselling.html">Relationship Counselling</a></li>
                        <li><a href="${rp}assessment.html">Psychological Assessments</a></li>
                        <li><a href="${svcPrefix}neuro-psychology.html">Neuro-Psychology</a></li>
                        <li><a href="${rp}index.html#new-services" class="footer-link-cta">View All Services</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h4 class="footer-col-title">Company</h4>
                    <ul class="footer-col-list">
                        <li><a href="${rp}team.html">About Us</a></li>
                        <li><a href="${rp}team.html">Our Team</a></li>
                        <li><a href="${rp}dr-safina.html">Dr. Safina Naaz</a></li>
                        <li><a href="${rp}assessment.html">Assessment</a></li>
                        <li><a href="${rp}index.html#locations">Dubai Centre</a></li>
                        <li><a href="${rp}index.html#locations">Bangalore Centre</a></li>
                        <li><a href="${rp}index.html#get-started">Online</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h4 class="footer-col-title">Legal</h4>
                    <ul class="footer-col-list">
                        <li><a href="${rp}privacy.html">Privacy Policy</a></li>
                        <li><a href="${rp}terms.html">Terms &amp; Conditions</a></li>
                        <li><a href="${rp}terms.html">Cancellation &amp; Refund Policy</a></li>
                        <li><a href="${rp}privacy.html">Cookie Policy</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h4 class="footer-col-title">Emergency Helplines</h4>
                    <ul class="footer-helpline-list">
                        <li>UAE: Aman - 800 4673 (free, 24/7)</li>
                        <li>UAE: MOHAP Mental Health - 800 4673</li>
                        <li>India: iCall - +91 9152987821</li>
                        <li>India: Tele MANAS - 14416</li>
                        <li>India: NIMHANS - 080 4611 0007</li>
                    </ul>
                </div>
            </div>
            <div class="footer-bottom-bar">
                <p class="footer-copyright footer-copyright--wide">Licensed by the Dubai Health Authority (DHA Licence No. [XXXXXX]) - RCI Registered (No. [XXXXXX]) - &copy; 2026 Calmyra Mental Wellness. All rights reserved.</p>
            </div>
        </div>
    </footer>
"@
}

$skip = @('index.html', 'privacy.html', 'terms.html', 'neuro-psychology.html')
$files = Get-ChildItem -Path $root -Recurse -Include *.html,*.htm -File | Where-Object {
    $_.FullName -notmatch '\\scripts\\' -and
    $_.FullName -notmatch '\\coaching\\' -and
    ($skip -notcontains $_.Name)
}

foreach ($file in $files) {
    $rel = $file.FullName.Substring($root.Length + 1)
    $depth = ($rel -split '[\\/]').Count - 1

    if ($depth -eq 0) {
        $rp = ''
        $svcPrefix = 'services/'
        $coachPrefix = 'services/coaching/'
    } elseif ($depth -eq 1) {
        $rp = '../'
        $svcPrefix = ''
        $coachPrefix = 'coaching/'
    } else {
        $rp = '../../'
        $svcPrefix = '../../services/'
        $coachPrefix = '../../services/coaching/'
    }

    $content = [IO.File]::ReadAllText($file.FullName)
    $orig = $content

    if ($content -match 'footer-address-label">Address') {
        $newFooter = Get-FooterHtml $rp $svcPrefix $coachPrefix
        $content = $content -replace '(?s)<footer id="footer"[^>]*>.*?</footer>', $newFooter.TrimEnd()
    }

    $content = $content -replace 'href="#footer" class="btn btn-primary', "href=`"${rp}index.html#get-started`" class=`"btn btn-primary"

    if ($content -ne $orig) {
        [IO.File]::WriteAllText($file.FullName, $content, $utf8)
        Write-Host "Fixed footer: $rel"
    }
}

Write-Host 'Footer fix complete.'
