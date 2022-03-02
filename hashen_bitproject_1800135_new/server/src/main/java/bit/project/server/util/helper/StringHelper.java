package bit.project.server.util.helper;

import java.util.ArrayList;

abstract public class StringHelper {
    public static String[] splitByCharacter(String text, char character){
        ArrayList<String> splitedText = new ArrayList<>();
        int startIndex = 0;

        for(int i=0; i<text.length(); i++){
            char ch = text.charAt(i);
            if(character == ch){
                if(i == 0) {
                    splitedText.add("");
                    startIndex = 1;
                } else if(text.charAt(i-1) != '\\'){
                    splitedText.add(text.substring(startIndex,i));
                    startIndex = i+1;
                }
            }
        }

        splitedText.add(text.substring(startIndex));
        return splitedText.toArray(String[]::new);
    }

    public static String SnakeCaseToSentenceCase(String snakeCaseText){
        String text = snakeCaseText.toLowerCase().replace('_', ' ');
        return text.substring(0, 1).toUpperCase() + text.substring(1);
    }

    public static String PascalCaseToLowerSnakeCase(String pascalCaseText){
        String text = pascalCaseText.trim();
        if(text.isEmpty()) return "";

        text = text.substring(0,1).toLowerCase()+text.substring(1);
        text = text.replaceAll("([A-Z])","_$1");
        text = text.toLowerCase();

        return text;
    }

}
