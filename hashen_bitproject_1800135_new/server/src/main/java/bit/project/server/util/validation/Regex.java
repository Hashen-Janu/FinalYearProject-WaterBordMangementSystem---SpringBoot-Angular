package bit.project.server.util.validation;

abstract public class Regex {
    public static final String PERSON_NAME = "^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$";
    public static final String NIC_NUMBER = "^(([0-9]{12})|([0-9]{9}[vVxX]))$";
    public static final String MOBILE_NUMBER = "^([0]?[7][0-9]{8})$";
    public static final String TELEPHONE_NUMBER = "^([0]?[0-9]{9})$";
    public static final String ADDRESS = "^(([\\w\\d\\/\\-]+[,\\s]+)*[\\w\\d\\/\\-]*[\\.]?)$";
}
