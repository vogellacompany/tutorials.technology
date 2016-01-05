#!/bin/bash

# this script is used to convert docbook files to asciidoc.
# prereqs: `yum install pandoc texlive texlive-xetex-bin 'tex(eu1enc.def)' 'tex(xetex.def)' 'tex(xltxtra.sty)' 'tex(mathspec.sty)'`
# See also http://johnmacfarlane.net/pandoc/installing.html for details

# optionally, it can also create html5, epub & pdf

# to preview .adoc files, open Chrome and install the Asciidoctor.js preview plugin. You MUST configure it to allow acess to local files or it won't work!
# to preview .epub files, open Chrome and install the Readium plugin, then add the .epub file to your library to view the file

usage ()
{
  echo "Usage: $0 -i infile -o outfile -WORKSPACE /some/folder/in/which/to/work"
  echo "Example: $0 -i /home/nboldt/tru/jbosstools-documentation/docs/User_Guide/JBoss_Tools_User_Guide/en-US/chap-OpenShift_Tools.xml -o /tmp/openshift"
  echo "Example: $0 -d /home/nboldt/tru/jbosstools-documentation/docs/User_Guide/JBoss_Tools_User_Guide/en-US"
  echo "Example: $0 -d /home/nboldt/tru/jbosstools-documentation/docs/User_Guide/JBoss_Tools_User_Guide/en-US \
    -map 'guibutton=command guilabel=command guimenu=command procedure=orderedlist step=listitem' \
    -to 'md html epub pdf'"
    # instead of <command>, can use <emphasis> if we want italics
  exit 1;
}

if [[ $# -lt 1 ]]; then
  usage;
fi

#defaults
INTERNAL_FORMAT=markdown # use pandoc's extended markdown, or else markdown_github, etc. See complete list here: http://johnmacfarlane.net/pandoc/README.html
WORKSPACE=`pwd`
INFILE=""
OUTFILE=""
OUTFORMATS=""

# this allows you to force docbook tags to be swapped for different docbook XML tags using sed. For example, replace all <guibutton> with <command>
MAPPINGS=""

# read commandline args
while [[ "$#" -gt 0 ]]; do
  case $1 in
    '-WORKSPACE') WORKSPACE="$2"; shift 1;;    
    '-i') INFILE="$2"; shift 1;;
    '-o') OUTFILE="$2"; OUTFILE=${OUTFILE%*.adoc}; shift 1;; # trim .adoc suffix, we'll add it on later
    '-d') INDIR="$2"; shift 1;;
    '-map') MAPPINGS="$MAPPINGS $2"; shift 1;;
    '-to') OUTFORMATS="$2"; shift 1;;
  esac
  shift 1
done

# processed defauls
if [[ ! $OUTFILE ]]; then OUTFILE=${INFILE/.xml/.adoc}; fi

convert ()
{
  INF=$1
  OUTF=$2
  echo -n "Convert ${INF##*/} to ${OUTF##*/}.adoc ..."

  # user-based pre-processing to replace tags w/ other tags
  if [[ $MAPPINGS ]]; then 
    # for each before=after pair, process the docbook file w/ sed to replace <before> with <after>
    for m in $MAPPINGS; do
      l=${m%%=*}
      r=${m##*=}
      # echo -n "$l -> $r ... "
      sed -i -e "s#<$l>#<$r>#g" -e "s#</$l>#</$r>#g" ${INF}
    done
  fi

  # using uft-8, convert docbook to internal format (eg., pandoc extended markdown)
  iconv -c -t utf-8 ${INF} | pandoc -f docbook -t ${INTERNAL_FORMAT} -o ${OUTF}.md  --toc --chapters --atx-headers
  # to change *ALL* bullets (unordered lists) to numbered lists in pandoc's markdown, enable the next line
  #sed -i -e "s/-   /#. /g" ${OUTF}.md
  iconv -c -t utf-8 ${OUTF}.md | pandoc -f ${INTERNAL_FORMAT} -t asciidoc -o ${OUTF}.adoc  --toc --chapters --atx-headers

  # fix placement of paragraph joiners (+) - should be flushed left, not indented
  sed -i -e "s/  +$/+/g" ${OUTF}.adoc

  # fix NOTE, TIP, IMPORTANT, WARNING, CAUTION
  # 1/3: change the delims from ______ to ====
  sed -i -e "s/\ \+__\+/====/g" ${OUTF}.adoc
  sed -i -e "s/__\+/====/g" ${OUTF}.adoc
  # 2/3: fix the indent
  awk '/\ ?(\*(Note|Tip|Important|Warning|Caution)\*)/ {inblock=1} /====/ {inblock=0;} 
  { if (inblock==1 && /(\ {2})(.+)/) { sub(/^[ \t]+/, ""); print } else print $0}' ${OUTF}.adoc > ${OUTF}.adoc.awkd; mv ${OUTF}.adoc.awkd ${OUTF}.adoc
  # 3/3: reorder the labels BEFORE the delims
  perl -0777 -pi -e 's/====\n\ ?\*(Note|Tip|Important|Warning|Caution)\*\n/\[\U\1\E\]\n====/igs' ${OUTF}.adoc

  # fix indented images
  awk '/  .+/ {inblock=1} /\+/ {inblock=0;}
  { if (inblock==1 && (/ {2}(.+)/)) { sub(/^[ \t]+/, ""); print } else print $0}' ${OUTF}.adoc > ${OUTF}.adoc.awkd; 
  mv ${OUTF}.adoc.awkd ${OUTF}.adoc

  # fix indented text blocks
  #awk '/ {2}(.+)/ { if (/ {2}(.+)/) { sub(/^[ \t]+/, ""); print } else print}' ${OUTF}.adoc > ${OUTF}.adoc.awkd; 
  #mv ${OUTF}.adoc.awkd ${OUTF}.adoc

  # optional conversions / formats
  if [[ ${OUTFORMATS} ]]; then
    if [[ ! ${OUTFORMATS##*html*} ]]; then 
      echo -n " to ${OUTF##*/}.html ..."
      pandoc ${OUTF}.md -o ${OUTF}.html -t html5
    fi

    if [[ ! ${OUTFORMATS##*epub*} ]]; then 
      echo -n " to ${OUTF##*/}.epub ..."
      pandoc -s -S ${OUTF}.md -o ${OUTF}.epub
    fi

    if [[ ! ${OUTFORMATS##*pdf*} ]]; then 
      echo -n " to ${OUTF##*/}.pdf ..."
      pandoc ${OUTF}.md -o ${OUTF}.pdf --latex-engine=xelatex
    fi

    if [[ ! ${OUTFORMATS##*md*} ]] || [[ ! ${OUTFORMATS##*markdown*} ]]; then 
      echo -n " to ${OUTF##*/}.md ..."
    fi
  else # remove intermediate .md file, as no longer needed
    rm -f ${OUTF}.md
  fi

  echo ""
}
# and now, do some work...
cd ${WORKSPACE}

if [[ $INDIR ]]; then # process directory for .xml files to convert
  pushd ${INDIR} >/dev/null
  for f in `find $INDIR -maxdepth 1 -mindepth 1 -type f -iname "*.xml" | sort`; do
    convert $f ${f%*.xml}
  done
  popd >/dev/null
elif [[ $INFILE ]]; then # process a single file
  pushd ${INFILE%/*} >/dev/null
  convert $INFILE ${OUTFILE}
  popd >/dev/null
else
  usage
fi
