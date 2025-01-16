// PlaceholderLinkPlugin.js
class PlaceholderLinkPlugin {
    constructor(options = {}) {
      // Set default options and override with user-provided options
      this.baseUrl = options.baseUrl || "https://example.com/details/";
      this.defaultStyles = options.styles || {
        color: "blue",
        fontWeight: "bold",
        textDecoration: "none",
        hoverColor: "green",
      };
    }
  
    init() {
      // Select all elements with the presence of the data-screenid attribute
      const placeholders = document.querySelectorAll("[data-screenid]");
  
      // Loop through each found element
      placeholders.forEach((placeholder, index) => {
        // Extract the inner HTML
        const content = placeholder.innerHTML;
  
        // Generate a unique session key for each placeholder
        const sessionKey = `placeholder_${index}`;
  
        // Check if there is any saved content for this placeholder in localStorage
        const savedContent = localStorage.getItem(sessionKey);
        if (savedContent) {
          placeholder.innerHTML = savedContent;
        }
  
        // Create a new anchor element
        const link = document.createElement("a");
        link.href = `${this.baseUrl}${index + 1}`; // Generate a unique link
        link.innerHTML = content; // Preserve the content
  
        // Apply inline styles
        link.style.color = this.defaultStyles.color;
        link.style.fontWeight = this.defaultStyles.fontWeight;
        link.style.textDecoration = this.defaultStyles.textDecoration;
  
        // Add hover effect
        link.addEventListener("mouseenter", () => {
          link.style.color = this.defaultStyles.hoverColor;
        });
        link.addEventListener("mouseleave", () => {
          link.style.color = this.defaultStyles.color;
        });
  
        // Add click event to save content in localStorage
        link.addEventListener("click", () => {
          localStorage.setItem(sessionKey, link.innerHTML);
          console.log(`Saved content for placeholder ${index}: ${link.innerHTML}`);
        });
  
        // Replace the span with the anchor
        placeholder.replaceWith(link);
      });
    }
  }
  
  // Export for use as a module
  export default PlaceholderLinkPlugin;
  