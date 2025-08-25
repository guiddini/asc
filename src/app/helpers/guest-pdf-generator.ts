import html2pdf from "html2pdf.js";

export const guestPdfGenerator = (name: string, code: string) => {
  const htmlContent = `<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="" xml:lang="">
<head>
<title></title>

<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
 <br/>
<style type="text/css">
<!--
	p {margin: 0; padding: 0;}	.ft10{font-size:12px;font-family:Times;color:#152038;}
	.ft11{font-size:12px;font-family:Times;color:#ffffff;}
	.ft12{font-size:11px;font-family:Times;color:#000000;}
	.ft13{font-size:117px;font-family:Times;color:#00c4c4;}
	.ft14{font-size:62px;font-family:Times;color:#00ebff;}
	.ft15{font-size:16px;font-family:Times;color:#00c4c4;}
	.ft16{font-size:12px;font-family:Times;color:#000000;}
	.ft17{font-size:33px;font-family:Times;color:#00c4c4;}
	.ft18{font-size:12px;font-family:Times;color:#00ebff;}
	.ft19{font-size:16px;line-height:28px;font-family:Times;color:#00c4c4;}
-->
</style>
</head>
<div id="export-pdf-container" bgcolor="#A0A0A0" vlink="blue" link="blue">
<div id="page1-div" style="position:relative;width:893px;height:1263px;">
<img width="893" height="1263" src="target001.png" alt="background image"/>
<p style="position:absolute;top:1162px;left:616px;white-space:nowrap" class="ft10"><i>Organisé&#160;par&#160;:</i></p>
<p style="position:absolute;top:125px;left:211px;white-space:nowrap" class="ft11">Sous&#160;le&#160;parrainage&#160;du&#160;Ministère&#160;de&#160;la&#160;Poste&#160;et&#160;des&#160;Télécommunications,&#160;</p>
<p style="position:absolute;top:145px;left:222px;white-space:nowrap" class="ft12">Sous&#160;le&#160;haut&#160;patronage&#160;du&#160;Ministère&#160;de&#160;la&#160;poste&#160;et&#160;des&#160;télécommunications</p>
<p style="position:absolute;top:163px;left:85px;white-space:nowrap" class="ft12">le&#160;Ministère&#160;de&#160;l’Economie&#160;de&#160;la&#160;connaissance&#160;et&#160;des&#160;startups&#160;et&#160;des&#160;micro-entreprises,&#160;Le&#160;Ministère&#160;du&#160;Commerce&#160;et&#160;de&#160;la</p>
<p style="position:absolute;top:181px;left:215px;white-space:nowrap" class="ft12">Promotion&#160;des&#160;Exportations,&#160;Le&#160;ministère&#160;de&#160;la&#160;Numérisation&#160;et&#160;des&#160;Statistiques.</p>
<p style="position:absolute;top:356px;left:189px;white-space:nowrap" class="ft13"><i><b>invitation&#160;</b></i></p>
<p style="position:absolute;top:476px;left:452px;white-space:nowrap" class="ft14"><i>Exclusive</i></p>
<p style="position:absolute;top:695px;left:58px;white-space:nowrap" class="ft19">Nous&#160;sommes&#160;ravis&#160;de&#160;vous&#160;convier&#160;à&#160;l'événement&#160;Algéria&#160;Fintech&#160;&amp;&#160;E-commerce<br/>Summit&#160;&#160;qui&#160;&#160;se&#160;&#160;tiendra&#160;&#160;le&#160;&#160;17&#160;&#160;et&#160;&#160;18&#160;&#160;février&#160;&#160;2024&#160;&#160;au&#160;&#160;Centre&#160;&#160;International&#160;&#160;de<br/>Conférences&#160;&#160;(CIC).&#160;&#160;Rejoignez-nous&#160;&#160;pour&#160;&#160;explorer&#160;&#160;les&#160;&#160;dernières&#160;&#160;tendances,<br/>échanger&#160;&#160;des&#160;&#160;idées&#160;&#160;novatrices&#160;&#160;et&#160;&#160;tisser&#160;&#160;des&#160;&#160;liens&#160;&#160;précieux&#160;&#160;dans&#160;&#160;les&#160;&#160;secteurs<br/>florissants&#160;de&#160;la&#160;Fintech&#160;et&#160;du&#160;e-commerce&#160;en&#160;Algérie.</p>
<p style="position:absolute;top:1108px;left:93px;white-space:nowrap" class="ft16"><i>www.algeriafintech.com</i></p>
<p style="position:absolute;top:1163px;left:171px;white-space:nowrap" class="ft16"><i>Algeria&#160;fintech&#160;&amp;&#160;e-commerce&#160;summit</i></p>
<p style="position:absolute;top:1134px;left:91px;white-space:nowrap" class="ft16"><i>+213&#160;550&#160;54&#160;52&#160;99/+213&#160;770&#160;77&#160;49&#160;99</i></p>
<p style="position:absolute;top:958px;left:202px;white-space:nowrap" class="ft16"><i>votre&#160;code&#160;d’invitation&#160;:&#160;</i></p>
<p style="position:absolute;top:978px;left:202px;white-space:nowrap" class="ft16"><i>3F-8B-6R-DB&#160;</i></p>
<p style="position:absolute;top:609px;left:60px;white-space:nowrap" class="ft17"><i>Mr&#160;&#160;Adel&#160;Ben&#160;Toumi,</i></p>
<p style="position:absolute;top:654px;left:60px;white-space:nowrap" class="ft18"><i>Président&#160;directeur&#160;général&#160;d'Algérie&#160;Télécom</i></p>
</div>
</div>
</html>
`;
  //   const div = document.getElementById("pdf-container");
  //   div.innerHTML = htmlContent;

  // Generate PDF from the div element

  //

  const options = {
    jsPDF: {
      unit: "mm",
      format: "a4",
      orientation: "portrait",
    },
  };

  // Generate PDF using html2pdf
  html2pdf().set(options).from(htmlContent).save();
};
