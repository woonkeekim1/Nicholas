import java.util.Scanner;

public class Area
{

    public static void main(String[] args)
    {
        int num1;
        int num2;

        Scanner input = new Scanner(System.in);
        prompt();
        int userInput = input.nextInt();
        while (userInput != 0 ) {
            if (userInput == 1) {
                num1 = askValue("enter the first Number", input);
                num2 = askValue("enter the second Number", input);

                System.out.println("Sum of the numbers is " + (num1 + num2));
            } else if (userInput == 2) {
                num1 = askValue("enter the first Number", input);
                num2 = askValue("enter the second Number", input);

                System.out.println("Difference of the numbers is " + (num1 - num2));
            } else if (userInput == 3) {
                num1 = askValue("enter the first Number", input);
                num2 = askValue("enter the second Number", input);

                System.out.println("Product of the numbers is " + (num1 * num2));
            } else if (userInput == 4) {
                num1 = askValue("enter the first Number", input);
                num2 = askValue("enter the second Number", input);

                System.out.println("Division of the numbers is " + ((double)num1 / (double)num2));
            } else {
                System.out.println("There is no function for this number " + userInput);
            }
            prompt();
            userInput = input.nextInt();
        }
    }

    private static int askValue(String question, Scanner input){
        System.out.println(question);
        return input.nextInt();
    }

    private static void prompt(){
        System.out.println("The program prompt following.\n" +
                "a user can select one of the following\n" +
                "0 - to end this program\n" +
                "1 - calculate sum\n" +
                "2 - calculate subtract\n" +
                "3 - calculate multiplication\n" +
                "4 - calculate division");
    }
}
