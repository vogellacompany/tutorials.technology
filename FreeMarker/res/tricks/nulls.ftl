<!-- Acts like if the color was N/A if there's no color: -->
<p>Color: ${color!'N/A'}</p>
 
<!-- Avoid the whole color row if there's no color: -->
<#if color??>
  <p>Color: ${color}</p>
</#if>
 