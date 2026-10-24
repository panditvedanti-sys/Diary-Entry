
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.Scanner;

public class EntryModifier {
    public static void modifyEntry(File file, Scanner scanner)
    {
        System.out.println("What would you like to do? Enter the number of the action you would like to take: ");
        System.out.println("1. Append text to the bottom. ");
        System.out.println("2. Overwrite / Clear and rewrite the file. ");
        System.out.println("3. Cancel and go back. ");
        int UserInput = scanner.nextInt();

        if (UserInput == 1)
        {
            System.out.print("Enter the content: If you want to add multiple lines, press Enter after each line. When you're done, type 'END' on a new line.");
            String content = "";
            while (true) 
            {
                String line = scanner.nextLine();
                if (line.equals("END"))
                {
                     break;
                }
                content = content + line + "\n";
            }
            
            try (FileWriter writer = new FileWriter(file, true))
            {
                writer.write("\n" + content);
                System.out.println("Success! Content has been appended. ");
            }
            catch (IOException e)
            {
                System.out.println("Error: could not append to the file.");
            }
        }
        else if (UserInput == 2)
        {
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
            
            try (FileWriter writer = new FileWriter(file))
            {
                writer.write("\n" + content);
                System.out.println("Success! Content has been replaced. ");
            }
            catch (IOException e)
            {
                System.out.println("Error: could not rewrite the file.");
            }
        }

        else if (UserInput == 3)
        {
            return;
        }

        else {
            System.out.println("Sorry, that is an invalid input. Please try again");
            modifyEntry(file, scanner);
        }

    }
}