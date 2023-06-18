console.log("Howdy partner");
fetch(
  "https://raw.githubusercontent.com/thinkle-iacs/web-design-portfolio/master/design/affordances.html"
).then((result) => {
  result.text().then((t) => {
    console.log(t);
    document.querySelector("#fixme").innerHTML = t;
  });
});
