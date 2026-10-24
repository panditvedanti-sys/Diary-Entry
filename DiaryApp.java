
import java.util.Scanner;
import java.time.LocalDate;
import java.util.regex.Pattern;
import java.io.FileWriter;
import java.io.IOException;
import java.io.File;
import java.io.FileNotFoundException;
import java.util.ArrayList;

public class DiaryApp {
    private static Scanner scanner = new Scanner(System.in);
    private static final Pattern DATE_PATTERN = Pattern.compile("\\d{4}-\\d{2}-\\d{2}");

    public static void main(String [] args) {
        System.out.println("Welcome to the Diary App!");
        System.out.println("You can enter your diary entries with a date, title, and content. You can store anything and everything you wish to here!");
        while (true) 
        {
            System.out.println("Menu Options (enter 1, 2, 3, 4, or 5): ");
            System.out.println("1. Add Entry");
            System.out.println("2. View Entries");
            System.out.println("3. Delete Entries");
            System.out.println("4. Modify an Existing Entry");
            System.out.println("5. Exit");
            String input = scanner.nextLine();
            if (input.equals("1")) 
            {
                addEntry();
            } 
            else if (input.equals("2")) {
                viewEntries();
            }
            else if (input.equals("3"))
            {
                deleteEntries();
            }
            else if (input.equals("4"))
            {
                System.out.println("Select a file to reference: ");
                System.out.println("Viewing entries...");
                File folder = new File(".");
                File[] listOfFiles = folder.listFiles();
                ArrayList<File> mdFiles = new ArrayList<>();
                int count = 1;
                if (listOfFiles != null)
                {
                    for (File f : listOfFiles) 
                    {
                        if (f.isFile() && f.getName().contains(".md"))
                        {
                            mdFiles.add(f);
                            System.out.println(count + ". " + f.getName());
                            count++;
                        }
                    }
                    if (mdFiles.isEmpty()) 
                    {
                        System.out.println("No entries available.");
                        return;
                    }
                    System.out.println("Which entry would you like to view? Enter the digit of the entry you want to view, or type back to return to the main menu.");
                    while (true)
                    {
                        String taken = scanner.nextLine();
                        if (taken.equals("back"))
                        {
                            break;
                        }
                        else 
                        {
                            try 
                            {
                                int x = Integer.parseInt(taken);
                                if (x > 0 && x <= mdFiles.size())
                                {
                                    File selected = mdFiles.get(x-1);
                                    EntryModifier.modifyEntry(selected, scanner);
                                    break;
                                }
                            }
                            catch (NumberFormatException e)
                            {
                                System.out.println("The input is invalid. Please enter a valid digit. ");
                            }
                        }
                    }
                }
            }
            else if (input.equals("5")) 
            {
                System.out.println("Exiting the Diary App. Goodbye!");
                System.exit(0);
            }
            else 
            {
                System.out.println("Invalid option. Please try again.");
            }   
        }
    }

    public static void addEntry() 
    {
        System.out.print("Enter the date (YYYY-MM-DD): ");
        String dateInput = scanner.nextLine();
        if (DATE_PATTERN.matcher(dateInput).matches()) 
        {
            LocalDate date = LocalDate.parse(dateInput);
            System.out.print("Enter the title: ");
            String title = scanner.nextLine();
            System.out.print("Enter the content: If you want to add multiple lines, press Enter after each line. When you're done, type 'END' on a new line.");
            String content = "";
            while (true) {
                String line = scanner.nextLine();
                if (line.equals("END"))
                {
                    break;
                }
                content = content + line + "\n";
            }
            Tracker entry = new Tracker(date, title, content);
            System.out.println("Entry added.");   
            saveEntryToFile(entry);
        }
        else {
            System.out.println("Invalid date format. Please use YYYY-MM-DD.");
        }
    }

    public static void saveEntryToFile (Tracker entry) 
    {
        String sanitizedTitle = entry.sanitizer(entry.getTitle()) + ".md";
        String formattedEntry = entry.formatter();
        try(FileWriter writer = new FileWriter(sanitizedTitle, true)) 
        {
            writer.write(formattedEntry);
            System.out.println("\n Success! Entry saved to file. It has been saved as: " + sanitizedTitle);
        }
        catch (IOException e) 
        {
            System.out.println("Error occurred while saving the entry to file.");
        }
    }

    public static void viewEntries() 
    {
        System.out.println("Viewing entries...");
        File folder = new File(".");
        File[] listOfFiles = folder.listFiles();
        ArrayList<File> mdFiles = new ArrayList<>();
        int count = 1;
        if (listOfFiles != null)
        {
            for (File f : listOfFiles) 
            {
                if (f.isFile() && f.getName().contains(".md"))
                {
                    mdFiles.add(f);
                    System.out.println(count + ". " + f.getName());
                    count++;
                }
            }
            if (mdFiles.isEmpty()) 
            {
                System.out.println("No entries available.");
                return;
            }
            System.out.println("Which entry would you like to view? Enter the digit of the entry you want to view, or type back to return to the main menu.");
            String input = scanner.nextLine();
            if (!input.equals("back"))
            {
                try 
                {
                    int x = Integer.parseInt(input);
                    if (x > 0 && x <= mdFiles.size())
                    {
                        File selected = mdFiles.get(x-1);
                        System.out.println("\n---- Opening: " + selected.getName() + ", please wait a moment");
                        try (Scanner fileReader = new Scanner(selected)) {
                            while (fileReader.hasNextLine())
                            {
                                String line = fileReader.nextLine();
                                System.out.println(line);
                            }
                            System.out.println("----------------------------------------------");
                        }
                        catch (FileNotFoundException e){
                            System.out.println("Error: Could not find or read that file. ");
                        }
                    }
                    else {
                        System.out.println("Selection out of bounds.");
                    }
                }
                catch (NumberFormatException e)
                {
                    System.out.println("Invalid input. Please enter a valid digit, else type back to return to the main menu.");
                }
            }
        }
    }

    public static void deleteEntries()
    {
        System.out.println("Viewing entries...");
        File folder = new File(".");
        File[] listOfFiles = folder.listFiles();
        ArrayList<File> mdFiles = new ArrayList<>();
        int count = 1;
        if (listOfFiles != null)
        {
            for (File f : listOfFiles) 
            {
                if (f.isFile() && f.getName().contains(".md"))
                {
                    mdFiles.add(f);
                    System.out.println(count + ". " + f.getName());
                    count++;
                }
            }
            if (mdFiles.isEmpty()) 
            {
                System.out.println("No entries available.");
                return;
            }
            System.out.println("Which entry would you like to delete? Enter the digit of the entry that you would like to delete, or type back to go back to the main menu.");
            String input = scanner.nextLine();
            if (!input.equals("back"))
            {
                try 
                {
                    int x = Integer.parseInt(input);
                    if (x > 0 && x <= mdFiles.size())
                    {
                       File fileToDelete = mdFiles.get(x-1);
                       if (fileToDelete.delete())
                       {
                            System.out.println("Congratulations! THe file has been successfully deleted. ");
                       }
                       else 
                       {
                            System.out.println("Error: the file could not be deleted; it may be open in another program. ");
                       }
                    }
                }
                catch (NumberFormatException e)
                {
                    System.out.println("Invalid input. Please enter a valid digit, else type back to return to the main menu.");
                    deleteEntries();
                }
            }
        }
    }
}