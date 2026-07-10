use strict;
use warnings;

my @files;
open(my $fh, "-|", q{find . -name "*.html" -not -path "./node_modules/*"}) or die;
while (<$fh>) {
    chomp;
    s{^\./}{};
    s{\\}{/}g;
    push @files, $_;
}
close $fh;

my $base = "https://www.calmyra.com";
open(my $out, ">", "sitemap.xml") or die;
print $out qq{<?xml version="1.0" encoding="UTF-8"?>\n};
print $out qq{<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n};
for my $f (sort @files) {
    my $loc = $f;
    $loc = "" if $loc eq "index.html";
    my $url = "$base/$loc";
    $url =~ s{'}{%27}g;
    my $priority = $f eq "index.html" ? "1.0" : ($f =~ m{^services/} ? "0.6" : "0.7");
    print $out qq{  <url>\n    <loc>$url</loc>\n    <priority>$priority</priority>\n  </url>\n};
}
print $out qq{</urlset>\n};
close $out;
print "wrote sitemap.xml with " . scalar(@files) . " urls\n";
