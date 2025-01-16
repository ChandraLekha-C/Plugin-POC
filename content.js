function hyperlinkWords(targetWords, apiUrl) {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);

  let currentNode;

  while ((currentNode = walker.nextNode())) {
    const text = currentNode.nodeValue;

    // Check if any of the target words exist in the current text node
    if (targetWords.some((word) => text.includes(word))) {
      const span = document.createElement("span");

      // Replace each target word with a hyperlink
      const regex = new RegExp(`\\b(${targetWords.join("|")})\\b`, "g");
      span.innerHTML = text.replace(regex, (match) => {
        return `<a href="#" class="dynamic-link trigger" data-id="${match}" style="color: blue; font-weight: bold; text-decoration: none;">${match}</a>`;
      });

      currentNode.parentNode.replaceChild(span, currentNode);
    }
  }

  // Create a popover element and style it
  const popover = document.createElement("div");
  popover.id = "popover";
  popover.style.position = "absolute";
  popover.style.display = "none";
  popover.style.backgroundColor = "#fff";
  popover.style.border = "1px solid #ccc";
  popover.style.borderRadius = "5px";
  popover.style.padding = "10px";
  popover.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.1)";
  popover.style.zIndex = "1000";
  popover.style.width = "300px";
  document.body.appendChild(popover);

  document.querySelectorAll(".dynamic-link").forEach((link) => {
    link.addEventListener("mouseover", (event) => {
      const itemId = link.getAttribute("data-id");

      fetch(`${apiUrl}?id=${itemId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          if (!Array.isArray(data) || data.length === 0) {
            popover.innerHTML = "<p>No data available</p>";
          } else {
            // Create the grid structure dynamically
            popover.innerHTML = `
              <div style="display: grid; grid-template-columns: 1fr 2fr 1fr; gap: 10px; align-items: center;">
                <div style="font-weight: bold; border-bottom: 1px solid #ccc;">ID</div>
                <div style="font-weight: bold; border-bottom: 1px solid #ccc;">Name</div>
                <div style="font-weight: bold; border-bottom: 1px solid #ccc;">Rent</div>
                ${data
                  .map(
                    (item) =>
                      `
                      <div style="border-bottom: 1px solid #eee;">${item.id}</div>
                      <div style="border-bottom: 1px solid #eee;">${item.name}</div>
                      <div style="border-bottom: 1px solid #eee;">${item.rent}</div>
                      `
                  )
                  .join("")}
              </div>
            `;
          }

          // Position and display the popover
          popover.style.display = "block";
          popover.style.left = `${event.pageX + 10}px`;
          popover.style.top = `${event.pageY + 10}px`;
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          popover.innerHTML = "<p>Error fetching details.</p>";
          popover.style.display = "block";
          popover.style.left = `${event.pageX + 10}px`;
          popover.style.top = `${event.pageY + 10}px`;
        });
    });

    link.addEventListener("mouseout", () => {
      popover.style.display = "none";
    });
  });
}

// Call the function with the words you want to hyperlink and the API URL
hyperlinkWords("http://localhost:5206/api/Property"
);  