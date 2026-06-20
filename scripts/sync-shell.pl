#!/usr/bin/perl
# Calmyra - Perl port of sync-shell.js for environments without Node.js
# Reads NAVBAR_TEMPLATE and FOOTER_TEMPLATE from sync-shell.js and applies to all HTML files

use strict;
use warnings;
use File::Find;
use File::Basename;
use File::Spec;
use Cwd 'abs_path';

my $ROOT = abs_path(dirname($0) . '/..');
my @IGNORE_DIRS = qw(node_modules .git scripts frontend backend memory test_reports tests .emergent);
my %IGNORE = map { $_ => 1 } @IGNORE_DIRS;

# Read the JS file to extract the templates
my $js_file = $ROOT . '/scripts/sync-shell.js';
open(my $fh, '<', $js_file) or die "Cannot read sync-shell.js: $!";
my $js_content = do { local $/; <$fh> };
close($fh);

# Extract NAVBAR_TEMPLATE (between backtick delimiters)
my ($navbar_template) = $js_content =~ /const NAVBAR_TEMPLATE = `(.*?)`;\s*\/\* -/s;
my ($footer_template) = $js_content =~ /const FOOTER_TEMPLATE = `(.*?)`;\s*\/\* -/s;

die "Could not extract NAVBAR_TEMPLATE from sync-shell.js" unless $navbar_template;
die "Could not extract FOOTER_TEMPLATE from sync-shell.js" unless $footer_template;

print "Templates extracted successfully.\n";

# Find all HTML files
my @html_files;
find(sub {
    if (-d $_ && $IGNORE{$_}) {
        $File::Find::prune = 1;
        return;
    }
    push @html_files, $File::Find::name if -f $_ && /\.html$/;
}, $ROOT);

sub base_for {
    my ($file_path) = @_;
    my $dir = dirname($file_path);
    my $rel = File::Spec->abs2rel($ROOT, $dir);
    return '' if $rel eq '.';
    $rel =~ s/\\/\//g;
    return $rel . '/';
}

sub replace_block {
    my ($html, $open_tag_re, $close_tag, $replacement) = @_;

    if ($html !~ /$open_tag_re/s) {
        return ($html, 0);
    }

    my $start = pos($html) // 0;
    $html =~ /$open_tag_re/sg;
    $start = $-[0];

    # Count depth to find matching close tag
    my $content = substr($html, $start);
    my $tag_name = ($close_tag =~ /<\/(\w+)>/)[0];
    my $depth = 0;
    my $pos = 0;
    my $end = -1;

    while ($pos < length($content)) {
        if (substr($content, $pos) =~ /\A<$tag_name[\s>]/i) {
            $depth++;
            $pos++;
        } elsif (substr($content, $pos) =~ /\A<\/$tag_name>/i) {
            $depth--;
            if ($depth == 0) {
                $end = $start + $pos + length($close_tag);
                last;
            }
            $pos++;
        } else {
            $pos++;
        }
    }

    if ($end == -1) {
        return ($html, 0);
    }

    my $before = substr($html, 0, $start);
    my $after = substr($html, $end);
    return ($before . $replacement . $after, 1);
}

my $nav_count = 0;
my $footer_count = 0;
my $total = 0;

for my $file (sort @html_files) {
    my $base = base_for($file);

    # Replace {BASE} in templates
    my $nav_html = $navbar_template;
    my $footer_html = $footer_template;
    $nav_html =~ s/\{BASE\}/$base/g;
    $footer_html =~ s/\{BASE\}/$base/g;

    open(my $in, '<', $file) or do { warn "Cannot read $file: $!"; next; };
    my $html = do { local $/; <$in> };
    close($in);

    my $nav_changed = 0;
    my $footer_changed = 0;

    # Replace navbar block
    if ($html =~ /<nav\s+id="navbar"[^>]*>/s) {
        my $match_start = $-[0];
        my $before = substr($html, 0, $match_start);
        my $rest = substr($html, $match_start);

        my $depth = 0;
        my $pos = 0;
        my $end = -1;

        while ($pos < length($rest)) {
            if (substr($rest, $pos) =~ /\A<nav[\s>]/i) {
                $depth++;
                $pos++;
            } elsif (substr($rest, $pos) =~ /\A<\/nav>/i) {
                $depth--;
                if ($depth == 0) {
                    $end = $pos + length('</nav>');
                    last;
                }
                $pos++;
            } else {
                $pos++;
            }
        }

        if ($end != -1) {
            $html = $before . $nav_html . substr($rest, $end);
            $nav_changed = 1;
        }
    }

    # Replace footer block
    if ($html =~ /<footer\s+id="footer"[^>]*>/s) {
        my $match_start = $-[0];
        my $before = substr($html, 0, $match_start);
        my $rest = substr($html, $match_start);

        my $depth = 0;
        my $pos = 0;
        my $end = -1;

        while ($pos < length($rest)) {
            if (substr($rest, $pos) =~ /\A<footer[\s>]/i) {
                $depth++;
                $pos++;
            } elsif (substr($rest, $pos) =~ /\A<\/footer>/i) {
                $depth--;
                if ($depth == 0) {
                    $end = $pos + length('</footer>');
                    last;
                }
                $pos++;
            } else {
                $pos++;
            }
        }

        if ($end != -1) {
            $html = $before . $footer_html . substr($rest, $end);
            $footer_changed = 1;
        }
    }

    if ($nav_changed || $footer_changed) {
        open(my $out, '>', $file) or do { warn "Cannot write $file: $!"; next; };
        print $out $html;
        close($out);
        $total++;
        $nav_count++ if $nav_changed;
        $footer_count++ if $footer_changed;
        my $rel = File::Spec->abs2rel($file, $ROOT);
        $rel =~ s/\\/\//g;
        my $tag = ($nav_changed ? 'N' : '-') . ($footer_changed ? 'F' : '-');
        print "  [$tag]  $rel\n";
    }
}

print "\n✓ Synced $total file(s)  ·  navbars: $nav_count  ·  footers: $footer_count\n";
