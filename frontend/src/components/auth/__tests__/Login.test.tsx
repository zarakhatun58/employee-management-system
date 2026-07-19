import {
  render,
  screen,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import Login from "../Login";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  MemoryRouter: ({ children }: any) => children,
  Link: ({ children }: any) => children,
  Navigate: () => null,
  useNavigate: () => mockNavigate,
}));

const mockLogin = jest.fn();
const mockRegister = jest.fn();
const mockClearError = jest.fn();

jest.mock("../../../store/auth.store", () => ({
  useAuthStore: () => ({
    token: null,
    loading: false,
    error: null,
    login: mockLogin,
    register: mockRegister,
    clearError: mockClearError,
  }),
}));

jest.mock("react-hot-toast", () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe("Login Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });


  test("renders login page", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(
      screen.getByText(
        /Employee Management System/i
      )
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /Sign In/i,
      })
    ).toBeInTheDocument();
  });


  test("email input works", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const email =
      screen.getByPlaceholderText(
        "you@company.com"
      );

    await user.type(
      email,
      "admin@ems.com"
    );

    expect(email).toHaveValue(
      "admin@ems.com"
    );
  });


  test("password input works", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );


    const password =
      screen.getByPlaceholderText(
        "password"
      );

    await user.type(
      password,
      "123456"
    );

    expect(password).toHaveValue(
      "123456"
    );
  });


  test("toggle register form", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );


    await user.click(
      screen.getByText(
        /Don't have an account/i
      )
    );


    expect(
      screen.getByText(
        /Create Account/i
      )
    ).toBeInTheDocument();


    expect(
      screen.getByPlaceholderText(
        "Full name"
      )
    ).toBeInTheDocument();
  });



  test("demo account button fills email", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );


    const demoButton =
      screen.getByRole(
        "button",
        {
          name: "Super Admin",
        }
      );


    await user.click(
      demoButton
    );


    expect(
      screen.getByDisplayValue(
        "admin@ems.com"
      )
    ).toBeInTheDocument();


    expect(
      screen.getByDisplayValue(
        "Admin@123"
      )
    ).toBeInTheDocument();
  });



  test("calls login on submit", async () => {
    mockLogin.mockResolvedValue(
      true
    );

    const user = userEvent.setup();


    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );


    await user.type(
      screen.getByPlaceholderText(
        "you@company.com"
      ),
      "admin@ems.com"
    );


    await user.type(
      screen.getByPlaceholderText(
        "password"
      ),
      "password123"
    );


    await user.click(
      screen.getByRole(
        "button",
        {
          name: /Sign In/i,
        }
      )
    );


    expect(
      mockLogin
    ).toHaveBeenCalledWith(
      "admin@ems.com",
      "password123"
    );
  });



  test("switch back to login from register", async () => {
    const user = userEvent.setup();


    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );


    await user.click(
      screen.getByText(
        /Don't have an account/i
      )
    );


    await user.click(
      screen.getByText(
        /Already have account/i
      )
    );


    expect(
      screen.getByRole(
        "button",
        {
          name: /Sign In/i,
        }
      )
    ).toBeInTheDocument();
  });

});