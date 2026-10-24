
import java.time.LocalDate;

public class Tracker {
    private LocalDate date;
    private String title;
    private String content;

    public Tracker(LocalDate d, String t, String c)
    {
        date = d;
        title = t;
        content = c;
    }

    public String formatter () {
        return date + " - " + title + ": " + content;
    }
    
    public LocalDate getDate() 
    {
        return date;
    }

    public String getTitle() 
    {
        return title;
    }

    public String getContent()
    {
        return content;
    }

    public String sanitizer (String title)
    {
        for (int i = 0; i < title.length(); i++)
        {
            if ((title.charAt(i) == ' ') || (title.charAt(i) == '/') || (title.charAt(i) == '.') || (title.charAt(i) == '\\') || (title.charAt(i) == ':') || (title.charAt(i) == '*') || (title.charAt(i) == '?') || (title.charAt(i) == '"') || (title.charAt(i) == '<') || (title.charAt(i) == '>') || (title.charAt(i) == '|'))
            {
                title = title.substring(0, i) + "_" + title.substring(i + 1);
            }
        }
        return title;
    } 
}