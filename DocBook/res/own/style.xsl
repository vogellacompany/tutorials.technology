<?xml version='1.0'?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	version="1.0">
	<xsl:import href="../docbook-xsl-1.77.1/html/docbook.xsl" />
	<xsl:template name="user.header.content">
		<xsl:variable name="codefile"
			select="document('../../../de.vogella.publishing/mystylesheets/headerstandalone.html',/)" />
		<xsl:copy-of select="$codefile/htmlcode/node()" />
	</xsl:template>
	<xsl:template name="user.footer.content">
		<xsl:variable name="codefile"
			select="document('../../../de.vogella.publishing/mystylesheets/footerstandalone.html',/)" />
		<xsl:copy-of select="$codefile/htmlcode/node()" />
	</xsl:template>

	<xsl:template name="user.head.content">
		<link rel="shortcut icon" href="http://www.vogella.com/favicon.ico" />
	</xsl:template>

	<xsl:template name="article.titlepage.before.recto">
		<xsl:if test="articleinfo">
			<div class="vogellalogo">
				<a rel="author" href="http://www.vogella.com/people/larsvogel.html">
					<img src="http://www.vogella.com/img/logo/preface.png" height="67"
						width="202" alt="About Lars Vogel" />
				</a>
			</div>
		</xsl:if>
	</xsl:template>

</xsl:stylesheet>