import type { Tip } from "./types";
import { CachedDataStore } from "./util/dataFetcher";

export let tips: Tip[] = [
  {
    title: "Copying data from Aspen to a spreadsheet",
    content: `
      The easiest way to copy data from Aspen to a spreadsheet
      is simply to use the printer icon in any view in Aspen and choose
      "Export as HTML." You can then select the data you want and copy
      it with <br><span class="ctrl"></span><span class="key">c</span> 
      then paste it into a spreadsheet with 
      <span class="ctrl"></span> <span class="key">shift</span> <span class="key">v</span>.
      <br>
      <br>You can also export data as a CSV and then use the <b>import CSV</b> feature
      of Google Sheets to import it, but I find this is usually slower in practice than
      just copying and pasting from the printed HTML view.
    `,
    link: `https://sites.google.com/innovationcharter.org/teacher-tech/aspen/copypasting-emails-from-aspen`,
  },
  {
    title: "Un-Close a Tab",
    content: `
			Accidentally closed a tab? Un-close it with
			<big><span class="ctrl"></span><span class="key">Shift</span><span class="key">T</span>.</big>
			<br><br>
			Some other handy browser shortcuts:
			<ul>
				<li><span class="ctrl"></span><span class="key">T</span> - new tab</li>
				<li><span class="ctrl"></span><span class="key">W</span> - close tab</li>
				<li><span class="ctrl"></span><span class="key">L</span> - focus location bar (URL)</li>
			</ul>
		`,
    link: "https://www.howtogeek.com/114518/47-keyboard-shortcuts-that-work-in-all-web-browsers/",
  },
  {
    title: "Printing in a Pinch",
    content: `
      <p>If you can't get printing to work, you can upload a PDF <em>directly</em>
      to the printer by typing its IP address into your browser as if it was a website.</p>
      <p>So if you type <a href="https://192.168.0.32" class="key"> 
      192.168.0.32</a> into your URL bar for Bernadette, you'll be able to access a simple
      web interface where you can upload a file to print.</p>
      
      <p>When something is wrong with the print server or 
      the print settings on your computer, the simple web interface
      can be a life saver (presuming both the network and the copier are still good to go).
      </p>
      <p>The copiers should have a sign near them that displays their IP 
      address, or you can find the list of printers on <a href=""https://sites.google.com/innovationcharter.org/teacher-tech/printers"">our support page</a> 
      </p>
      
    `,
    link: "https://sites.google.com/innovationcharter.org/teacher-tech/printers",
  },
  {
    title: "Staff can borrow student machines in a pinch",
    content: `
      If you get to school and realize you left a laptop at home, no sweat &mdash; either the Library 
      or Nick are happy to sign a student chromebook out to you for the day to use.
      <br>
      It's good to get a feel for the tools are students are using once in a while anyway :)          
    `,
  },
  {
    title: `Love wordle? Play at school`,
    content: `
    There's an easter-egg built into the staff signout bot where you can play
    wordle by chatting a 5-letter word to the bot.
    <br>
    <br>If you're a real wordle addict, Tom also wrote his own wordle-clone
    which you should check out <a href="https://www.nordle.us">www.nordle.us</a>    
    `,
    link: "https://www.nordle.us",
  },
];
export let tipDataStore = new CachedDataStore({
  defaultValue: tips,
  name: "tips",
  expiresAfter: 24 * 60 * 60 * 1000,
  url: "https://script.google.com/macros/s/AKfycbwMbmd-9KnPDPyK3F-ziSLSSulwIpmvD0bja_s7N-trdiqAZLqgpsSocIAPHirLZb67/exec?tips=true",
});
